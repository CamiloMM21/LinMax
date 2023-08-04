import React from "react";
import { motion } from "framer-motion";
import Chats from "./Chats";
import Close from "./img/Close.png"

const MiComponente = ({ onClose, PostId }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center ">
      <motion.div
        initial={{ opacity: 1, scale: 0.5 }}
        animate={{ opacity: 2, scale: 1 }}
        exit={{ opacity: 5, scale: 0.5 }}
        transition={{ duration: 0.3 }}
      >
        {" "}
       <div className="relative ">
        <img src={Close} onClick={onClose}
          className="  bg-gray-200 hover:bg-gray-300  rounded-md   hover:rounded-md w-7 mt-4 absolute static ml-[87%] cursor-pointer  hover:opacity-40 "/>
       </div>
        <div className="w-96 py-2 px-4 max-sm:w-auto pl-5  ">
          <Chats postId={PostId} />
        </div>
      </motion.div>
    </div>
  );
};

export default MiComponente;
