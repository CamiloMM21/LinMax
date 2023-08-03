import React,{useState, useEffect, useContext}from "react";
import { motion } from "framer-motion";
import Conversation from "./Conversation";
import Close from "../Chat/img/Close.png"
import { db } from "../../database/firebase";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";

const CloseComponent = ({ onClose, postId, imgf, name, selectedMessage}) => {

  const userContext = useContext(AuthContext);

  const uidd = userContext.currentUser.uid;

  const [nombre, setNombre] = useState("");
  const [photo, setPhoto] = useState("");
  useEffect(() => {
    // DEFINIMOS UNA FUNCION ASINCRONA QUE OBTENDRÁ EL DOCUMENTO QUE NECESITAMOS
    const fetchUser = async () => {
   
      const docRf = doc(db, "users", uidd);
      const docSnp = await getDoc(docRf);
      const userInfo = docSnp.data();
      setNombre(userInfo.userName.split(" ")[0]);
      setPhoto(userInfo.photoURL.downloadURL );
    };

    fetchUser();

  
    
  }, [uidd]);

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
          className=" bg-gray-200 hover:bg-gray-300  rounded-md   hover:rounded-md w-7 mt-4 absolute static ml-[87%] cursor-pointer  hover:opacity-40 "/>
       </div>
        <div className="w-96 py-2 px-4 max-sm:w-auto pl-5">
          <Conversation  nombr={name}  imgf={imgf} nombrr={nombre} imgff={photo} selectedMessage={selectedMessage}/>
        </div>
      </motion.div>
    </div>
  );
};

export default CloseComponent;