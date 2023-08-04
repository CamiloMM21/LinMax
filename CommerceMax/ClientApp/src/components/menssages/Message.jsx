import React, { useState, useContext } from "react";
import CloseComponent from "./CloseComponent";
import { ToastContainer, toast } from "react-toastify";


function Message({ messages, imgf, nombre, postId }) {

  const [modalAbierto, setModalAbierto] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");

  const handleClick = (messages) => {
    toast.warn('Esta conversación es privada, de lo contrario no se guardará ningún mensaje, si cierras el chat perderas todos los mensajes de esta conversacion.', {
      position: "top-center",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      onClose: () => {
        setTimeout(() => {
          setModalAbierto(true);
          setSelectedMessage(messages);
        }, 7500)
      }
    });
  };


  const cerrarModal = () => {
    setModalAbierto(false);
  };



  return (
    <div>
      <div>
        {modalAbierto && (
          <CloseComponent onClose={cerrarModal} postId={postId} imgf={imgf} name={nombre} selectedMessage={selectedMessage} />
        )}
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700 bg-slate-200 hover:bg-slate-300 "
        >
          <a onClick={() => handleClick(messages)}>
            <li className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img className="w-8 h-8 rounded-full" src={imgf} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {nombre}
                  </p>
                  <p className="text-sm text-gray-700 truncate dark:text-gray-400">
                    {messages}
                  </p>
                </div>
                <div className="mr-12">
                  <span className="relative flex h-3 w-3 mr-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 "></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 "></span>
                  </span>
                </div>
              </div>
            </li>
          </a>
        </ul>
      </div>
      <ToastContainer className="toastWidth" />
    </div>
  );
}

export default Message;
