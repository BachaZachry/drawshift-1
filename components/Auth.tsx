import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import { Fragment, useRef } from 'react';
import GoogleLogin from 'react-google-login';
import { useGlobalStore } from 'lib/useGlobalStore';
import useAuth from 'lib/hooks/useAuth';

export const AuthPopup = () => {
  const cancelButtonRef = useRef();
  const setAuthModalOpen = useGlobalStore((state) => state.setAuthModalOpen);
  const authModalOpen = useGlobalStore((state) => state.authModalOpen);

  const { googleAuthMutation } = useAuth();

  const closeModal = () => {
    setAuthModalOpen(false);
  };

  function responseGoogle(response) {
    googleAuthMutation.mutate(response.accessToken);
  }

  return (
    <Transition
      show={authModalOpen}
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
        open={authModalOpen}
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

          <div className="px-16 py-8">
            <GoogleLogin
              className="!rounded-lg"
              clientId="865137569538-2k4mc40dur78flg8p1ncbu39h9n1tjtr.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={responseGoogle}
              onFailure={(err) => console.log(err)}
            />
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
