import { BigHead } from "@bigheads/core";
import { motion } from "framer-motion";
import LZString from "lz-string";
import { observer } from "mobx-react";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AvatarButtons from "../../components/avatar/AvatarButtons";
import { Basic, Colored, Modal } from "../../components/avatar/AvatarProps";
import { styles } from "../../components/avatar/AvatarStyles";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import MultiStep from "../../components/common/MultiStep";
import { avatar, toast } from "../../utils/Store";

const variants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: "-100%" },
};

const CreateAvatar: React.FC<Modal> = observer(({ handleClose, show }) => {
  const history = useHistory();

  // Handles Step proccessing during avatar creation
  const [Step, setStep] = useState(0);
  const incrementSteps = useCallback(() => setStep(Step + 1), [Step]);
  const decreaseSteps = useCallback(() => setStep(Step - 1), [Step]);

  // Button text depends on step number
  const [CancelButton, setCancelButton] = useState("Cancel");
  const [NextButton, setNextButton] = useState("Next");
  useEffect(() => {
    Step === 0 ? setCancelButton("Cancel") : setCancelButton("Back");
    Step < 2 ? setNextButton("Next") : setNextButton("Done");
  }, [Step]);

  // Confirms and save choices for later use (Compressed with lz-string)

  const handleSubmit = () => {
    localStorage.setItem("avatar", LZString.compress(JSON.stringify(avatar)));
    handleClose();
    toast.setVisible(true);
    history.push("/lobby");
  };

  return (
    <div className={` ${styles.popup} ${show ? "block" : "hidden"}`}>
      <div className="inset-0 transition-opacity" aria-hidden="true">
        <div className={styles.backdrop}></div>
      </div>

      <motion.div animate={show ? "open" : "closed"} variants={variants}>
        <div
          className={styles.cardContainer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className={styles.card}>
            <h3 className={styles.title}>Customize your character</h3>
            <hr className={styles.divider} />
            <div className="-mt-16 mb-8 w-full">
              <BigHead {...avatar} />
            </div>
            {Step === 0 && <AvatarButtons parts={Basic} />}
            {Step === 1 && <AvatarButtons parts={Colored} />}
            {Step === 2 && (
              <>
                <Input
                  onChange={(e: any) => avatar.setName(e.target.value)}
                  value={avatar.name}
                  placeholder="Nickname"
                />
              </>
            )}
          </div>
          <div className={styles.stepsContainer}>
            <Button
              text={CancelButton}
              clickable={true}
              onClick={() => (Step === 0 ? handleClose() : decreaseSteps())}
            />
            <MultiStep steps={3} progress={Step} />
            <Button
              text={NextButton}
              clickable={true}
              onClick={() => (Step < 2 ? incrementSteps() : handleSubmit())}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default CreateAvatar;
