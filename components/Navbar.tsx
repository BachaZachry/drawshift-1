import { Disclosure } from "@headlessui/react";
import { LoginIcon } from "@heroicons/react/solid";
import { useAppDispatch, useAppSelector } from "lib/hooks";
import { open, close } from "lib/uiLoginSlice";
import { loadUser, username, uStatus } from "lib/userSlice";
import { useRouter } from "next/router";
import { useEffect } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const user = useAppSelector(username) == null ? false : true;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userStatus = useAppSelector(uStatus);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const logout = () => {
    console.log("log out");
  };
  const openLoginForm = () => {
    dispatch(open());
  };

  // If a token is available,check if it's valid
  useEffect(() => {
    if (userStatus == "idle" || userStatus == "failed") {
      if (token != null) {
        dispatch(loadUser());
      }
    }
  }, [userStatus]);

  // Close login form when you successfully login
  useEffect(() => {
    if (userStatus == "succeeded") {
      dispatch(close());
    }
  }, [userStatus]);

  return (
    <Disclosure as="nav" className="relative bg-gray-800">
      {({ open }) => (
        <>
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex items-center mr-2 -ml-2 md:hidden">
                  {/* Mobile menu button */}
                </div>
                <div className="flex items-center flex-shrink-0">
                  <img
                    className="block w-auto h-8 lg:hidden"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                    alt="Workflow"
                  />
                  <img
                    className="hidden w-auto h-8 lg:block"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                    alt="Workflow"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {!!user && (
                    <button
                      onClick={logout}
                      type="button"
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm font-monst focus:outline-none"
                    >
                      <div
                        className="invisible w-5 h-5 mr-2 -ml-1"
                        aria-hidden="true"
                      />
                      <span>Logout</span>
                    </button>
                  )}
                  {!!user ? (
                    <button
                      onClick={() => router.push("/dashboard")}
                      type="button"
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white transition duration-200 bg-indigo-500 border border-transparent rounded-md shadow-sm font-monst hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                    >
                      <LoginIcon
                        className="w-5 h-5 mr-2 -ml-1"
                        aria-hidden="true"
                      />
                      <span>Launch</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={openLoginForm}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white transition duration-200 bg-indigo-500 border border-transparent rounded-md shadow-sm font-monst hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                    >
                      <LoginIcon
                        className="w-5 h-5 mr-2 -ml-1"
                        aria-hidden="true"
                      />
                      <span>Sign in</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
