// @ts-nocheck
import { Dialog, Transition, Listbox } from '@headlessui/react';
import {
  InboxIcon,
  MenuIcon,
  UserCircleIcon,
  XIcon,
} from '@heroicons/react/outline';
import {
  ReplyIcon,
  SaveAsIcon,
  TrashIcon,
  PencilIcon,
  FastForwardIcon,
  XCircleIcon,
  DownloadIcon,
  DuplicateIcon,
} from '@heroicons/react/solid';
import Head from 'next/head';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Main } from '../components/styled/board.styled';
import { HexColorPicker } from 'react-colorful';
// Drawing
import { useRouter } from 'next/router';
import { useGlobalStore } from 'lib/useGlobalStore';
import useDrawing from 'lib/hooks/useDrawing';
import useAuth from 'lib/hooks/useAuth';

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

// Drawing

const Drawing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [color, setColor] = useState('#aabbcc');
  const router = useRouter();
  const [socketUrl, setSocketUrl] = useState(
    'ws://localhost:8000/ws/chat/' + 'room_1718731252411' + '/'
  );
  const [path, setPaths] = useState([]);
  const canvasDataRef = useRef([]);
  const canvasRef = useRef(null);
  const [title, setTitle] = useState('');
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {});

  // Undo state
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);

  // Eraser
  const [isErasing, setIsErasing] = useState(false);

  const user = useGlobalStore((state) => state.user);

  const { signOutMutation } = useAuth();
  // const { addDrawingMutation } = useDrawing();

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  if (!user) {
    router.push('/');
  }

  const changeTitle = (e) => {
    setTitle(e.target.value);
  };

  // Saving Drawing
  const onSubmit = (e) => {
    e.preventDefault();

    const base64_image = canvasRef.current
      ?.toDataURL('image/png')
      .split(',')[1];

    addDrawingMutation.mutate({ title, path, base64_image });
  };

  // Handlers
  const undoHandler = () => {
    if (currentStep >= 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (newStep === -1) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvasDataRef.current = [];
      } else {
        canvasDataRef.current = history[newStep];
      }
      drawOnCanvas(ctx, canvasDataRef.current);
      handleCanvasUpdate(canvasDataRef.current);
    }
  };

  const redoHandler = () => {
    if (currentStep < history.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      canvasDataRef.current = history[currentStep + 1];
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      drawOnCanvas(ctx, canvasDataRef.current);
      handleCanvasUpdate(canvasDataRef.current);
    }
  };

  const resetCanvasHandler = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvasDataRef.current = [];
      setHistory([]);
      setCurrentStep(-1);
      handleCanvasUpdate(canvasDataRef.current);
    }
  };

  const penHandler = () => {
    setIsErasing(false);
  };

  const eraserHandler = () => {
    setIsErasing(true);
    console.log(isErasing);
  };

  const exportImage = () => {
    if (canvasRef.current) {
      const originalCanvas = canvasRef.current;

      // Create a temporary canvas
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = originalCanvas.width;
      tempCanvas.height = originalCanvas.height;
      const tempCtx = tempCanvas.getContext('2d');

      // Fill the temporary canvas with a white background
      tempCtx.fillStyle = 'white';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw the original canvas content onto the temporary canvas
      tempCtx.drawImage(originalCanvas, 0, 0);

      // Get the image data URL from the temporary canvas
      const imageDataURL = tempCanvas.toDataURL('image/png');

      // Create a link and trigger the download
      let a = document.createElement('a');
      a.href = imageDataURL;
      a.download = 'Image.png';
      a.click();
      a.remove();
    }
  };

  const handleCanvasUpdate = useCallback(
    (data) => {
      sendMessage(JSON.stringify({ type: 'canvas_update', canvas_data: data }));
    },
    [sendMessage]
  );

  const drawOnCanvas = useCallback((ctx, canvasData) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    canvasData.forEach((path) => {
      ctx.beginPath();
      path.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          if (point.isEraser) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 20;
          } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
          }
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    });
  }, []);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth;

        // Redraw the canvas content if necessary
        const ctx = canvas.getContext('2d');
        drawOnCanvas(ctx, canvasDataRef.current);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [drawOnCanvas]);

  useEffect(() => {
    if (lastMessage !== null) {
      const { type, canvas_data } = JSON.parse(lastMessage.data);
      if (type === 'canvas_update') {
        canvasDataRef.current = canvas_data;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        drawOnCanvas(ctx, canvas_data);
      }
    }
  }, [lastMessage, drawOnCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const handleCanvasMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      canvasDataRef.current.push([{ x, y, isEraser: isErasing }]);
      setHistory((prevHistory) => [
        ...prevHistory.slice(0, currentStep + 1),
        [...canvasDataRef.current],
      ]);
      setCurrentStep((prevStep) => prevStep + 1);
      handleCanvasUpdate(canvasDataRef.current);
    };
    const handleCanvasMouseMove = (e) => {
      if (e.buttons !== 1) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const currentPath =
        canvasDataRef.current[canvasDataRef.current.length - 1];
      currentPath.push({ x, y, isEraser: isErasing });
      drawOnCanvas(ctx, canvasDataRef.current);
      handleCanvasUpdate(canvasDataRef.current);
    };
    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    return () => {
      canvas.removeEventListener('mousedown', handleCanvasMouseDown);
      canvas.removeEventListener('mousemove', handleCanvasMouseMove);
    };
  }, [handleCanvasUpdate, drawOnCanvas, currentStep]);

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
                      onClick={() => signOutMutation.mutate()}
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
          <div className="flex flex-col items-center justify-between mx-auto mt-2 lg:flex-row max-w-7xl">
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
            <div className="flex flex-wrap justify-center mt-5 lg:mt-0 lg:ml-4">
              <span className="ml-3">
                <button
                  onClick={undoHandler}
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
                  onClick={resetCanvasHandler}
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
                  onClick={redoHandler}
                  type="button"
                  className="inline-flex items-center px-4 py-2 my-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FastForwardIcon
                    className="w-5 h-5 mr-2 -ml-1 text-gray-500"
                    aria-hidden="true"
                  />
                  Redo
                </button>
              </span>
              <span className="ml-3">
                <button
                  onClick={eraserHandler}
                  type="button"
                  className="inline-flex items-center px-4 py-2 my-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <XCircleIcon
                    className="w-5 h-5 mr-2 -ml-1 text-gray-500"
                    aria-hidden="true"
                  />
                  Eraser
                </button>
              </span>
              <span className="ml-3">
                <button
                  onClick={penHandler}
                  type="button"
                  className="inline-flex items-center px-4 py-2 my-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PencilIcon
                    className="w-5 h-5 mr-2 -ml-1 text-gray-500"
                    aria-hidden="true"
                  />
                  Pen
                </button>
              </span>
              <span className="ml-3">
                <button
                  onClick={() => navigator.clipboard.writeText(roomId)}
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
                  className="inline-flex items-center px-4 py-2 my-1 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <DownloadIcon
                    className="w-5 h-5 mr-2 -ml-1"
                    aria-hidden="true"
                  />
                  Download Image
                </button>
              </span>
            </div>
          </div>
          <div className="h-auto mx-auto mt-8 bg-white rounded-lg shadow-lg max-w-7xl relative">
            <canvas
              ref={canvasRef}
              height={450}
              width="100%"
              className="rounded-xl"
            />
          </div>
          <div className="flex flex-wrap justify-center mt-5 lg:mt-0 lg:ml-4">
            <HexColorPicker color={color} onChange={setColor} />
          </div>
        </Main>
      </div>
    </div>
  );
};

export default Drawing;
