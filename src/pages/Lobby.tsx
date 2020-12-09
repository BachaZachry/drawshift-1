import { BigHead } from "@bigheads/core";
import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import RoomIcon from "../assets/icons/RoomIcon";
import Create from "../components/lobby/LobbyCreate";
import Login from "../components/lobby/LobbyLogin";
import { styles } from "../components/lobby/LobbyStyles";
import { auth, avatar } from "../store/Store";

const Lobby = () => {
  const [login, setLogin] = useState(false);
  const [create, setCreate] = useState(false);

  const history = useHistory();
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: [0, 1],
      y: [-100, 0],
    });
  }, []);

  const transition = async () => {
    if (auth.isRegistred) {
      await controls.start({
        opacity: [1, 0],
        y: [0, -100],
      });
      history.push(`/lobby/${auth.room}`);
    }
  };

  return (
    <motion.div
      animate={controls}
      transition={{ duration: 1, delay: 0.5 }}
      initial={{ opacity: 0 }}
    >
      <Login
        show={login}
        handleClose={() => setLogin(false)}
        confirmed={() => transition()}
      />

      <Create
        show={create}
        handleClose={() => setCreate(false)}
        confirmed={() => transition()}
      />

      <div className={styles.root}>
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            <div className={styles.user}>
              <div className="max-w-xl mb-6 px-4">
                <h2 className={styles.welcomeText}>
                  Greetings{" "}
                  <span className={styles.nameText}>{avatar.name}!</span>
                </h2>
                <p className={styles.normalText}>
                  <strong>Note:</strong> You might encounter occasional bugs,
                  please reach out to us with details if you face any.
                </p>
              </div>
              <hr className="mb-6 border-gray-300" />
              <div className="flex">
                <div className="h-32 w-32 -mt-6">
                  <BigHead {...avatar} />
                </div>
                <div className="flex flex-col mt-8">
                  <div className="text-sm font-semibold">Level 01</div>
                  <div className="text-xs text-gray-700">Novice</div>
                </div>
              </div>
            </div>
            <div className={styles.room}>
              <div className="mb-5 font-semibold">Get Started</div>
              <div className="flex justify-center w-full mb-3">
                <button
                  onClick={() => setCreate(true)}
                  className={styles.createButton}
                >
                  <div className="flex items-center animate-pulse">
                    <div className="mr-3 font-semibold text-white">
                      Create a room
                    </div>
                    <RoomIcon />
                  </div>
                </button>
              </div>
              <p className={styles.decriptionText}>
                This will generate a room identifier that you can share with
                whom you are playing with.
              </p>
              <div className="flex items-center w-full mb-5">
                <hr className="flex-1 border-gray-300" />
                <div className="px-3 text-xs text-gray-500 sm:text-sm">or</div>
                <hr className="flex-1 border-gray-300" />
              </div>
              <button
                onClick={() => setLogin(true)}
                className={styles.joinButton}
              >
                Join an existing one
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Lobby;
