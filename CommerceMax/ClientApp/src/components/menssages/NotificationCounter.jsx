import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { HiOutlineMail } from "react-icons/hi";
import { AuthContext } from "../../context/AuthContext";
import Message from "./Message";

function NotificationCounter({ postId }) {
  const [notificationCount, setNotificationCount] = useState(0);
  const [showMessenger, setShowMessenger] = useState(false);
  const [messages, setMessages] = useState([]);
  const userContext = useContext(AuthContext);
  const uuid = userContext.currentUser.uid;
  const [uiid, setUiid] = useState(null); // CREA UNA VARIABLE DE ESTADO PARA GUARDAR EL UID

  const [imgf, setImgf] = useState("");
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:4000", {
      query: {
        uid: uuid,
      },
    });
    setUiid(uuid);
    socket.on("nuevo mensaje", ({ message, photo, uid , nombre }) => {
      if (uiid === uid) {
        // SI EL UID COINCIDE, AGREGA EL MENSAJE EN LA LISTA
        setMessages(message);
        //  ACTUALIZAR EL CONTADOR DE NOTIFICACIONES
        setNotificationCount((count) => count + 1);
        setImgf(photo);
        setNombre(nombre);
      }
     
    });
  }, [uiid]);

  const handleClick = () => {
    setShowMessenger(!showMessenger);
    setNotificationCount(0);
  };

  return (
    <div>
      <button className="bun " onClick={handleClick}>
        <HiOutlineMail />
        {notificationCount > 0 && (
          <span className="absolute right-0 top-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-black rounded-full border-white bg-opacity-50 border">
            {notificationCount}
          </span>
        )}
      </button>

      {showMessenger && (
        <div className="fixed bottom-20 right-10 w-64 h-96 bg-bggray border border-gray-700 shadow-lg">
          <div className="p-4 border-b border-gray-700 font-medium text-lg bg-gradient-to-r from-gray-300 to-gray-100 text-black ">
            Messages
          </div>
          <div className=" text-gray-500">
            {messages.length === 0 ? (
              <div className="p-8 text-white">You have no messages yet.</div>
            ) : (
              <Message
                messages={messages}
                postId={postId} imgf={imgf} nombre={nombre}  
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCounter;
