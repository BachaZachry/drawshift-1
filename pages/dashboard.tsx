// @ts-nocheck
import { Dialog, Listbox, Transition } from '@headlessui/react';
import {
  ArchiveIcon,
  BanIcon,
  BellIcon,
  FlagIcon,
  InboxIcon,
  MenuIcon,
  PencilAltIcon,
  SearchIcon,
  UserCircleIcon,
  XIcon,
} from '@heroicons/react/outline';
import {
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  FilterIcon,
  LocationMarkerIcon,
  LogoutIcon,
  MailIcon,
  SelectorIcon,
  UsersIcon,
  ViewGridAddIcon,
  ViewGridIcon,
  ViewListIcon,
} from '@heroicons/react/solid';
import Spinner from 'components/Spinner';
import React, { Fragment, useEffect, useState } from 'react';
import {
  Header,
  HeaderButtons,
  HeaderContainer,
  HeaderContent,
  HeaderProfile,
  Main,
  Search,
  Searchbar,
  SearchbarContainer,
  Utils,
} from '../components/styled/dashboard.styled';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { RoomPopup } from 'components/RoomPopup';
import { useGlobalStore } from 'lib/useGlobalStore';
import useAuth from 'lib/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

const getRoomId = () => `room_${+new Date()}`;

const Dasboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const user = useGlobalStore((state) => state.user);
  const retrieveUserBoards = useGlobalStore(
    (state) => state.retrieveUserBoards
  );
  const [joinRoom, setJoinRoom] = useState(false);

  const { setUserQuery, signOutMutation } = useAuth();

  const retrieveBoardsQuery = useQuery({
    queryKey: ['boards'],
    queryFn: () => retrieveUserBoards(),
    enabled: !!user,
  });

  const { data } = retrieveBoardsQuery;

  const { isLoading } = setUserQuery;

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user]);

  const openJoinRoom = () => {
    setJoinRoom(true);
  };

  if (isLoading || !user) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-primary font-monst">
      <Head>
        <title>Drawshift | Dashboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {/* Top nav*/}
      <header className="relative flex items-center flex-shrink-0 h-16 bg-primary">
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
                  <a href="/dashboard">
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
        {/* Main area */}
        <Main>
          {/* Page header */}
          <Header>
            <HeaderContainer>
              <HeaderContent>
                <HeaderProfile>
                  {/* Profile */}
                  <div className="flex items-center">
                    {/* <img
                      className="hidden w-16 h-16 border-2 border-white border-solid rounded-full sm:block"
                      src={user.user_metadata.avatar_url}
                      alt=""
                    /> */}
                    <div>
                      <div className="flex items-center">
                        <h1 className="ml-3 text-3xl font-bold text-white sm:truncate">
                          Good morning, {user?.username}
                        </h1>
                      </div>
                      <dl className="flex flex-col mt-6 sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                        <dt className="sr-only">Account status</dt>
                        <dd className="flex items-center mt-3 text-sm font-medium text-gray-200 capitalize sm:mr-6 sm:mt-0">
                          <CheckCircleIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-200"
                            aria-hidden="true"
                          />
                          Verified account
                        </dd>
                      </dl>
                    </div>
                  </div>
                </HeaderProfile>
                <HeaderButtons>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition duration-200 rounded-md shadow-lg bg-secondary hover:bg-primary hover:text-gray-100 focus:outline-none"
                  >
                    Settings
                    <MailIcon
                      className="w-5 h-5 ml-2 -mr-1"
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => signOutMutation.mutate()}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition duration-200 rounded-md shadow-lg bg-secondary hover:bg-primary hover:text-gray-100 focus:outline-none"
                  >
                    Logout
                    <LogoutIcon
                      className="w-5 h-5 ml-2 -mr-1"
                      aria-hidden="true"
                    />
                  </button>
                </HeaderButtons>
              </HeaderContent>
            </HeaderContainer>
          </Header>

          <div className="mt-8">
            <Searchbar>
              <SearchbarContainer>
                <Search>
                  <input
                    className="w-full px-4 py-3 text-sm font-medium text-gray-300 transition duration-200 rounded-md shadow-sm bg-secondary hover:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Search..."
                  />
                  <SearchIcon
                    className="w-5 h-5 -ml-8 text-gray-400"
                    aria-hidden="true"
                  />
                </Search>

                <button
                  onClick={() =>
                    router.push({
                      pathname: '/drawing',
                      query: { room: getRoomId() },
                    })
                  }
                  type="button"
                  className="relative inline-flex items-center p-2  my-2 text-gray-400 transition duration-200 rounded-md shadow h-11  bg-secondary font-monst dark:text-gray-200 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-500 focus:text-gray-100 focus:ring-indigo-500"
                >
                  <h3>New Drawing</h3>
                </button>
                <button
                  onClick={() =>
                    router.push({
                      pathname: '/diagram',
                      query: { room: getRoomId() },
                    })
                  }
                  type="button"
                  className="relative inline-flex items-center p-2  my-2 text-gray-400 transition duration-200 rounded-md shadow h-11 bg-secondary font-monst dark:text-gray-200 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-500 focus:text-gray-100 focus:ring-indigo-500"
                >
                  <h3>New Diagram</h3>
                </button>
                <RoomPopup open={joinRoom} setOpen={setJoinRoom} />

                <button
                  onClick={openJoinRoom}
                  type="button"
                  className="relative inline-flex items-center p-2 text-gray-400 transition duration-200 rounded-md shadow h-11 bg-secondary font-monst dark:text-gray-200 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-500 focus:text-gray-100 focus:ring-indigo-500"
                >
                  <h3>Join a room</h3>
                </button>
              </SearchbarContainer>
            </Searchbar>
            <div className="flex flex-row flex-wrap max-w-6xl  px-4 pt-8 mx-auto sm:px-6 lg:px-0">
              {data?.drawings?.map((drawing) => (
                <button
                  onClick={() =>
                    router.push({
                      pathname: `/drawing/${drawing.id}`,
                      query: { room: getRoomId() },
                    })
                  }
                  key={drawing.id}
                >
                  <img
                    src={`data:image/png;base64,${drawing.base64_image}`}
                    alt={drawing.title}
                    className="object-cover w-80 h-48 rounded mx-2 my-2"
                  />
                </button>
              ))}
              {data?.diagrams?.map((diagram) => (
                <button
                  onClick={() =>
                    router.push({
                      pathname: `/diagram/${diagram.id}`,
                      query: { room: getRoomId() },
                    })
                  }
                  key={diagram.id}
                >
                  <img
                    src={`data:image/png;base64,${diagram.base64_image}`}
                    alt={diagram.title}
                    className="object-cover w-80 h-48 rounded mx-2 my-2"
                  />
                </button>
              ))}
            </div>
          </div>
        </Main>
      </div>
    </div>
  );
};
export default Dasboard;
