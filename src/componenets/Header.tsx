import React from "react";

interface Modal {
  handleOpen: any;
}

const Header: React.FC<Modal> = ({ handleOpen }) => {
  return (
    <div className="relative bg-deep-purple-accent-400 ">
      <div className="absolute inset-x-0 bottom-0">
        <svg
          viewBox="0 0 224 12"
          fill="currentColor"
          className="w-full -mb-1 text-white"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C48.8902582,6.27314026 86.2235915,9.40971039 112,9.40971039 C137.776408,9.40971039 175.109742,6.27314026 224,0 L224,12.0441132 L0,12.0441132 L0,0 Z" />
        </svg>
      </div>
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 md:py-40">
        <div className="relative max-w-2xl sm:mx-auto sm:max-w-xl md:max-w-2xl sm:text-center">
          <h1 className="mb-6 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl sm:leading-none">
            <span className="relative inline-block px-2">
              <span className="relative text-teal-accent-400">Drawshift</span>
              <div className="w-full h-3 -mt-3 bg-deep-purple-accent-200" />
            </span>
            is the game that
            <br className="hidden md:block" />
            ruins friendships{" "}
          </h1>
          <p className="mb-6 text-base text-indigo-100 md:text-lg">
            Create or join a room, make your own avatar and start playing
            <br></br>
            with your friends in a fun and chaotic drawing game.
          </p>

          <div className="">
            <a
              onClick={handleOpen}
              className="inline-flex items-center justify-center h-12 px-6 mb-12 font-semibold tracking-wide text-teal-900 transition duration-200 rounded shadow-md hover:text-deep-purple-900 bg-teal-accent-400 hover:bg-deep-purple-accent-100 focus:shadow-outline focus:outline-none"
            >
              Get started
            </a>
          </div>

          <a
            href="/"
            aria-label="Scroll down"
            className="flex items-center justify-center w-10 h-10 mx-auto text-white duration-300 transform border border-gray-400 rounded-full hover:text-teal-accent-400 hover:border-teal-accent-400 hover:shadow hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="currentColor"
            >
              <path d="M10.293,3.293,6,7.586,1.707,3.293A1,1,0,0,0,.293,4.707l5,5a1,1,0,0,0,1.414,0l5-5a1,1,0,1,0-1.414-1.414Z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
