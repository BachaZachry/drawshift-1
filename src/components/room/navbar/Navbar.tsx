import { motion } from "framer-motion";
import React from "react";
import tw, { styled } from "twin.macro";
import ClipboardIcon from "../../../assets/icons/ClipboardIcon";
import { auth } from "../../../store/Store";
import Button from "../../common/Button";
import { styles } from "../RoomStyles";
import NavbarButtons from "./NavbarButtons";

const NavbarLogo = () => (
  <div className="flex-none w-64 h-64 bg-vod-logo rounded-r-full border-r-8 border-vod-primary flex items-center justify-center">
    <div className="w-12 h-12 rounded-full bg-vod-content flex justify-center items-center">
      <svg
        width="24"
        height="27"
        viewBox="0 0 26 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23.8333 0H5.41667C3.98058 0.00163456 2.60379 0.567965 1.58833 1.57475C0.572861 2.58154 0.00164865 3.94656 0 5.37037V16.1111C0.000645154 16.6806 0.229126 17.2267 0.635315 17.6294C1.0415 18.0321 1.59223 18.2586 2.16667 18.2593H9.58425L8.67764 24.5517C8.67035 24.6021 8.66668 24.6528 8.66667 24.7037C8.66667 25.8432 9.12321 26.9359 9.93587 27.7416C10.7485 28.5474 11.8507 29 13 29C14.1493 29 15.2515 28.5474 16.0641 27.7416C16.8768 26.9359 17.3333 25.8432 17.3333 24.7037C17.3334 24.6529 17.3297 24.6021 17.3225 24.5517L16.4156 18.2593H23.8333C24.4078 18.2586 24.9585 18.0321 25.3647 17.6294C25.7709 17.2267 25.9994 16.6806 26 16.1111V2.14815C25.9994 1.57862 25.7709 1.0326 25.3647 0.629884C24.9585 0.227167 24.4078 0.00063964 23.8333 0ZM5.41667 2.14815H17.3333V6.44444C17.3333 6.72931 17.4475 7.0025 17.6506 7.20393C17.8538 7.40536 18.1293 7.51852 18.4167 7.51852C18.704 7.51852 18.9795 7.40536 19.1827 7.20393C19.3859 7.0025 19.5 6.72931 19.5 6.44444V2.14815H23.8333L23.8341 10.7407H2.16667V5.37037C2.16763 4.51608 2.51035 3.69705 3.11964 3.09297C3.72892 2.4889 4.55501 2.14911 5.41667 2.14815ZM15.1656 24.7724C15.1478 25.3301 14.9118 25.8591 14.5076 26.2473C14.1035 26.6356 13.5628 26.8527 13 26.8527C12.4372 26.8527 11.8965 26.6356 11.4924 26.2473C11.0882 25.8591 10.8522 25.3301 10.8344 24.7724L11.7729 18.2593H14.2271L15.1656 24.7724ZM23.8333 16.1111H2.16667V12.8889H23.8344L23.8347 16.1111H23.8333Z"
          fill="white"
        />
      </svg>
    </div>
    <h1 className=" text-white font-bold px-4 text-xl">Drawshift</h1>
  </div>
);

export const Clipboard = styled.div`
  ${tw`flex-grow flex justify-center items-center invisible md:visible`}
`;

const Navbar = () => {
  return (
    <motion.div
      animate={{ opacity: [0, 1], y: [-100, 0] }}
      transition={{ duration: 1, delay: 0.5 }}
      initial={{ opacity: 0 }}
      className={styles.navbar}
    >
      <NavbarLogo />
      <Clipboard>
        <Button Rounded whileTap={{ scale: 0.9 }}>
          <ClipboardIcon />
          <span className="pl-2">{auth.room}</span>
        </Button>
      </Clipboard>

      <NavbarButtons />
    </motion.div>
  );
};

export default Navbar;
