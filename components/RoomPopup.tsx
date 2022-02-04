import { Dialog, Transition } from "@headlessui/react";
import { LoginIcon, XIcon } from "@heroicons/react/solid";
import { Fragment, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "lib/hooks";
import { uiLoginState, open, close } from "lib/uiLoginSlice";

export const RoomPopup = () => {
  const cancelButtonRef = useRef();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loginForm = useAppSelector(uiLoginState);
  const [room, setRoom] = useState("");

  const closeModal = () => {
    dispatch(close());
  };
  const openDrawingRoom = (e) => {
    e.preventDefault();
    router.push({ pathname: "/drawing", query: { id: room } });
  };
  const openChartingRoom = (e) => {
    e.preventDefault();
    router.push({ pathname: "/chart", query: { id: room } });
  };
  const changeRoom = (e) => {
    setRoom(e.target.value);
  };
  return (
    <Transition
      show={loginForm}
      //@ts-ignore
      as={Fragment}
      enter="transition-opacity duration-300 ease-out"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200 ease-out"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Dialog
        open={loginForm}
        initialFocus={cancelButtonRef}
        static
        onClose={closeModal}
        className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto font-monst"
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />

        <div className="z-20 flex flex-col bg-white rounded-lg opacity-100">
          <div className="flex justify-end pt-3 pr-3">
            <button className="focus:outline-none" onClick={() => closeModal()}>
              <XIcon className="w-5 h-5 text-green-400" aria-hidden="true" />
            </button>
          </div>
          <form className="flex flex-col">
            <input
              type="text"
              placeholder="Room Id"
              className="inline-flex px-4 py-2 my-1 mx-4 text-sm font-medium text-gray-700 transition duration-200 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={room}
              onChange={changeRoom}
              required
            />
            <div className="flex flex-row">
              <span className="ml-3 my-3">
                <button
                  type="submit"
                  onClick={openDrawingRoom}
                  className="inline-flex items-center px-4 py-2 my-1 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Drawing Room
                </button>
              </span>
              <span className="mx-3 my-3">
                <button
                  type="submit"
                  onClick={openChartingRoom}
                  className="inline-flex items-center px-4 py-2 my-1 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Charting Room
                </button>
              </span>
            </div>
          </form>
        </div>
      </Dialog>
    </Transition>
  );
};
