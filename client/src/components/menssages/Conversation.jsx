import React, { useState, useEffect, useContext } from "react";
import Send from "../Chat/img/Send.png";
import io from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";

function Conversation({ nombr, imgf, nombrr, imgff, selectedMessage }) {
  const userContext = useContext(AuthContext);
  const photoURL = userContext.currentUser?.photoURL;
  const firsName = userContext.currentUser?.displayName;
  const uidd = userContext.currentUser.uid;

  console.log(selectedMessage);
  const socket = io("http://localhost:4000", {
    query: {
      uid: uidd,
    },
  });

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      socket.emit("message2", { message });

      const newMessage = {
        body: message,
        from: "Me",
      };
      setMessages([...messages, newMessage]);
    }

    setMessage("");
  };

  useEffect(() => {
    // DEFINIMOS UNA FUNCION ASINCRONA QUE OBTENDRÁ EL DOCUMENTO QUE NECESITAMOS
    const fetchUser = () => {};
    fetchUser();

    const receiveMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]); // UPDATED
    };
    socket.on("message2", receiveMessage);

    return () => {
      socket.off("message2", receiveMessage);
    };
  }, []);

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className=" shadow-lg rounded-lg ">
      <div
        id="container"
        className="w-[100%] max-w-[750px] bg-white
       m-auto  border-gray-600 border shadow-lg rounded-lg"
      >
        <div className="shadow-md shadow-gray-700/50">
          <div className="grid  pt-3 w-24  text-left mr-[100%] grid-cols-2">
            <img
              src={imgff || photoURL}
              className="rounded-full  ml-2 mb-2  cursor-pointer h-12 "
            />
            <span className="font-semibold text-lg text-black mr-[80%] pl-4 pt-1 cursor-pointe gap-2 ">
              {nombrr || firsName}
              <p className="text-xs text-gray-500  pl-1">private</p>
            </span>
          </div>
        </div>

        <div className="relative w-[100%] bg-gray-200 md:h-[340px] sm:h-[300px] xl:h-[360px] overflow-auto scrollbar-thin scrollbar-thumb-thin pt-[10px] pr-[30px] pl-[30px] pb-[20px] shadow-gray-500 overflow-x-hidden border border-gray-300">
          <br />
          <div className="flex justify-center items-center ">
            <img
              className="absolute w-10 h-10 rounded-full cursor-pointer top-2"
              src={imgf}
            />
            <span className=" absolute font-semibold text-lg top-12 text-gray-600">
              <p>{nombr}</p>
            </span>
          </div>
          <div className="mt-24">
            <p className={`max-w-max max-sm:text-sm my-2 p-2 table text-sm  pr-4 pl-4 pb-2  ${" bg-white rounded-r-full rounded-b-full font-semibold  text-black" }`}>
              {selectedMessage}
            </p>

            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-max max-sm:text-sm my-2 p-2 table text-sm  pr-4 pl-4 pb-2  ${
                  message.from === "Me"
                    ? "mr-1  bg-gray-800 ml-auto rounded-l-full rounded-b-full font-semibold text-white "
                    : "bg-white rounded-r-full rounded-b-full font-semibold  text-black"
                }`}
              >
                <p>{message.body || message}</p>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between max-h-[81px] w-[100%] pl-1 pr-1 mt-2">
            <textarea
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyDown={handleInputKeyDown}
              placeholder=" Type something..."
              className="text-[18px] w-full mx-1 px-4 border-transparent mb-2 h-8 pt-1 xl:w-[90%] max-sm:w-[70%] placeholder:max-sm:text-[11px] bg-gradient-to-r from-gray-300 to-gray-200  text-black placeholder-gray-500 text-sm rounded-md block p-2.5 shadow-md shadow-gray-700/50 hover:border-transparent focus:border-transparent outline-none caret-gray-700 focus:ring-gray-100 focus:border-gray-100"
              style={{ resize: "none", overflow: "hidden" }}
            />

            <button
              type="submit"
              className="bottom-none  pr-[14px] border-white mb-2 text-white cursor-pointer bg-gradient-to-r from-gray-300 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-md h-8 shadow-md shadow-gray-700/50 ml-2 max-sm:w-[100%]"
            >
              <img className="ml-2" src={Send} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Conversation;
