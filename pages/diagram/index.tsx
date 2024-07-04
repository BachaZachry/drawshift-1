// @ts-nocheck
import { Dialog, Transition } from '@headlessui/react';
import {
  InboxIcon,
  MenuIcon,
  UserCircleIcon,
  XIcon,
} from '@heroicons/react/outline';
import {
  ReplyIcon,
  SaveAsIcon,
  PlusCircleIcon,
  TrashIcon,
  DuplicateIcon,
} from '@heroicons/react/solid';
import Head from 'next/head';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Main } from '../../components/styled/board.styled';
import { HexColorPicker } from 'react-colorful';
import { useRouter } from 'next/router';
import { useGlobalStore } from 'lib/useGlobalStore';
import useAuth from 'lib/hooks/useAuth';
import useDiagram from 'lib/hooks/useDiagram';
import 'reactflow/dist/style.css';
import { toPng } from 'html-to-image';
import Toast from 'components/Toast';

const sidebarNavigation = [
  { name: 'Open', href: '#', icon: InboxIcon, current: true },
  {
    name: 'Your Profile',
    href: '/dashboard',
    icon: UserCircleIcon,
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const getNodeId = () => `randomnode_${+new Date()}`;

const Diagram = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#aabbcc');
  const [socketUrl, setSocketUrl] = useState(null);
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  const user = useGlobalStore((state) => state.user);

  const { signOutMutation } = useAuth();

  const { addDiagramMutation } = useDiagram();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl,
    {}
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    if (router.isReady && router.query.room) {
      setSocketUrl(
        `${process.env.NEXT_PUBLIC_BACKEND_WS_HOST}${router.query.room}/`
      );
    }
  }, [router.isReady, router.query.room]);

  if (!user) {
    router.push('/');
  }

  const logout = () => {
    signOutMutation.mutate();
  };

  const changeTitle = (e) => {
    setTitle(e.target.value);
  };

  const sendWebSocketMessage = (type, data) => {
    sendJsonMessage({
      type: 'diagram_update',
      operation: type,
      diagram_data: data,
      user_id: user.id,
    });
  };

  useEffect(() => {
    if (addDiagramMutation.isSuccess) {
      setShowToast(true);
      setTitle('');
      clearDiagram();
    }
  }, [addDiagramMutation.isSuccess]);

  const onSubmit = (e) => {
    e.preventDefault();

    const diagram = document.querySelector('.react-flow');
    toPng(diagram, { backgroundColor: '#fff' }).then((dataUrl) => {
      addDiagramMutation.mutate({
        title,
        nodes,
        edges,
        base64_image: dataUrl.split(',')[1],
      });
    });
  };

  const onUpdateGraph = useCallback(
    (event, node) => {
      const updatedNode = { id: node.id, position: node.position };
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id ? { ...n, position: node.position } : n
        )
      );
      sendWebSocketMessage('move', updatedNode);
    },
    [setNodes, sendWebSocketMessage]
  );

  // Removing node/edge
  const onNodesDelete = useCallback(
    (deleted) => {
      setNodes((nds) =>
        nds.filter((n) => !deleted.some((del) => del.id === n.id))
      );
      setEdges((eds) =>
        eds.filter(
          (e) =>
            !deleted.some((del) => del.id === e.source || del.id === e.target)
        )
      );
      sendWebSocketMessage('remove', deleted);
    },
    [setNodes, setEdges, sendWebSocketMessage]
  );

  // Adding a node
  const addNode = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      data: { label: 'new node' },
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    sendWebSocketMessage('add', newNode);
  }, [setNodes, sendWebSocketMessage]);

  // Adding edge
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
      sendWebSocketMessage('addEdge', params);
    },
    [setEdges, sendWebSocketMessage]
  );

  // Handling different updates
  useEffect(() => {
    if (lastJsonMessage != null) {
      const { operation, diagram_data, user_id } = lastJsonMessage;

      if (user_id == user) {
        return;
      }
      switch (operation) {
        case 'remove':
          setNodes((nds) =>
            nds.filter((n) => !diagram_data.some((del) => del.id === n.id))
          );
          setEdges((eds) =>
            eds.filter(
              (e) =>
                !diagram_data.some(
                  (del) => del.source === e.source && del.target === e.target
                )
            )
          );
          break;
        case 'move':
          setNodes((nds) =>
            nds.map((n) =>
              n.id === diagram_data.id
                ? { ...n, position: diagram_data.position }
                : n
            )
          );
          break;
        case 'add':
          setNodes((nds) => [...nds, diagram_data]);
          break;
        case 'addEdge':
          setEdges((eds) => addEdge(diagram_data, eds));
          break;
        case 'clear':
          setNodes([]);
          setEdges([]);
          break;
      }
    }
  }, [lastJsonMessage]);

  const clearDiagram = useCallback(() => {
    setNodes([]);
    setEdges([]);
    sendWebSocketMessage('clear', null);
  }, [setNodes, setEdges, sendWebSocketMessage]);

  const exportImage = useCallback(() => {
    const diagram = document.querySelector('.react-flow');
    const controls = document.querySelector('.react-flow__controls');
    const minimap = document.querySelector('.react-flow__minimap');
    if (diagram) {
      const controlsDisplay = controls.style.display;
      const minimapDisplay = minimap.style.display;

      controls.style.display = 'none';
      minimap.style.display = 'none';

      toPng(diagram, { backgroundColor: '#fff' })
        .then((dataUrl) => {
          let a = document.createElement('a');
          a.href = dataUrl;
          a.download = 'Image.png';
          a.click();
          a.remove();

          controls.style.display = controlsDisplay;
          minimap.style.display = minimapDisplay;
        })
        .catch((err) => {
          console.error('Failed to export diagram as image', err);
          controls.style.display = controlsDisplay;
          minimap.style.display = minimapDisplay;
        });
    }
  }, [title]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100 dark:bg-dark font-monst">
      {/* Top nav*/}
      <Head>
        <title>Drawshift | Boards</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header className="relative flex items-center flex-shrink-0 h-16 bg-gray-100 dark:bg-dark">
        {/* Logo area */}
        <div className="absolute inset-y-0 left-0 md:static md:flex-shrink-0">
          <a
            href="/dashboard"
            className="flex items-center justify-center w-16 h-16 bg-none md:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:w-20"
          >
            <img
              className="w-auto h-8"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
              alt="Workflow"
            />
          </a>
        </div>

        {/* Menu button area */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-6 md:hidden">
          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 -mr-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <MenuIcon className="block w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop nav area */}

        {/* Mobile menu, show/hide this `div` based on menu open/closed state */}

        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog
            as="div"
            static
            className="fixed inset-0 z-40 md:hidden"
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="hidden sm:block sm:fixed sm:inset-0 sm:bg-gray-600 sm:bg-opacity-75" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-150 sm:ease-in-out sm:duration-300"
              enterFrom="transform opacity-0 scale-110 sm:translate-x-full sm:scale-100 sm:opacity-100"
              enterTo="transform opacity-100 scale-100  sm:translate-x-0 sm:scale-100 sm:opacity-100"
              leave="transition ease-in duration-150 sm:ease-in-out sm:duration-300"
              leaveFrom="transform opacity-100 scale-100 sm:translate-x-0 sm:scale-100 sm:opacity-100"
              leaveTo="transform opacity-0 scale-110  sm:translate-x-full sm:scale-100 sm:opacity-100"
            >
              <nav
                className="fixed inset-0 z-40 w-full h-full bg-white sm:inset-y-0 sm:left-auto sm:right-0 sm:max-w-sm sm:w-full sm:shadow-lg"
                aria-label="Global"
              >
                <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                  <a href="#">
                    <img
                      className="block w-auto h-8"
                      src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=500"
                      alt="Workflow"
                    />
                  </a>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 -mr-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close main menu</span>
                    <XIcon className="block w-6 h-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="px-2 mx-auto space-y-1 max-w-8xl sm:px-4">
                    <a
                      href="/dashboard"
                      className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-50"
                    >
                      Your Profile
                    </a>
                    <button
                      className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md hover:bg-gray-50"
                      onClick={logout}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </nav>
            </Transition.Child>
          </Dialog>
        </Transition.Root>
      </header>

      {/* Bottom section */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Narrow sidebar*/}
        <nav
          aria-label="Sidebar"
          className="hidden shadow-xl md:block md:flex-shrink-0 md:bg-gray-800 md:overflow-y-auto"
        >
          <div className="relative flex flex-col w-20 p-3 space-y-3">
            {sidebarNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-400 hover:bg-gray-700',
                  'flex-shrink-0 inline-flex items-center justify-center h-14 w-14 rounded-lg'
                )}
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="w-6 h-6" aria-hidden="true" />
              </a>
            ))}
          </div>
        </nav>

        {/* Main area */}
        <Main>
          {/* Page header */}
          <div className="flex flex-col items-center justify-between mx-auto mt-2 md:flex-row max-w-7xl">
            <nav className="flex" aria-label="Breadcrumb"></nav>
            <form className="flex flex-grow" onSubmit={onSubmit}>
              <input
                className="inline-flex px-4 py-2 my-1 text-sm font-medium text-gray-700 transition duration-200 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Title"
                value={title}
                onChange={changeTitle}
                required
              />
              <span className="ml-3">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 my-1 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <SaveAsIcon
                    className="w-5 h-5 mr-2 -ml-1"
                    aria-hidden="true"
                  />
                  Save
                </button>
              </span>
            </form>
            <div className="flex flex-wrap justify-start mt-5 lg:mt-0 lg:ml-4">
              <span className="ml-3">
                <button
                  onClick={addNode}
                  type="button"
                  className="inline-flex items-center px-4 py-2 my-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusCircleIcon
                    className="w-5 h-5 mr-2 -ml-1 text-gray-500"
                    aria-hidden="true"
                  />
                  Add Node
                </button>
              </span>
              <span className="ml-3">
                <button
                  onClick={() => console.log('undo')}
                  type="button"
                  className="inline-flex items-center px-4 py-2 my-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ReplyIcon
                    className="w-5 h-5 mr-2 -ml-1 text-gray-500"
                    aria-hidden="true"
                  />
                  Undo
                </button>
              </span>

              <span className="ml-3">
                <button
                  onClick={clearDiagram}
                  type="button"
                  className="inline-flex items-center px-4 py-2 my-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <TrashIcon
                    className="w-5 h-5 mr-2 -ml-1 text-gray-500"
                    aria-hidden="true"
                  />
                  Clear
                </button>
              </span>
              <span className="ml-3">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(router.query.room)
                  }
                  type="button"
                  className="inline-flex items-center px-4 py-2 my-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <DuplicateIcon
                    className="w-5 h-5 mr-2 -ml-1 text-gray-500"
                    aria-hidden="true"
                  />
                  Copy Room Id
                </button>
              </span>
              <span className="ml-3">
                <button
                  onClick={exportImage}
                  type="button"
                  className="inline-flex items-center px-4 py-2 my-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Export
                </button>
              </span>
              {/* Dropdown */}
            </div>
          </div>
          <div className="flex flex-row h-auto mx-auto mt-8 bg-white rounded-lg shadow-lg max-w-7xl">
            <div className="w-full h-[600px]">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDragStop={onUpdateGraph}
                onNodesDelete={onNodesDelete}
              >
                <Controls />
                <Background color="#aaa" gap={16} />
                <MiniMap nodeStrokeWidth={3} zoomable pannable />
              </ReactFlow>
            </div>
          </div>
          <div className="flex flex-col items-center pt-12">
            <HexColorPicker color={color} onChange={setColor} />
          </div>
        </Main>
        <Toast
          show={showToast}
          setShow={setShowToast}
          message="Added diagram successfully!"
        />
      </div>
    </div>
  );
};

export default Diagram;
