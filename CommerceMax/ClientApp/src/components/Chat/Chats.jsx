import React, { useState, useEffect, useContext } from "react";
import Send from "./img/Send.png";
import io from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../database/firebase";
import { collection, doc, getDoc, addDoc, serverTimestamp, setDoc, updateDoc} from "firebase/firestore";



function Chats({ postId }) {
  const userContext = useContext(AuthContext);
  const photoURL = userContext.currentUser?.photoURL;
  const uidd = userContext.currentUser.uid;

  const socket = io('http://localhost:4000', {
    query: {
      uid: uidd,
    },
  });

  const [user, setUser] = useState({
    email: '',
    userName: '',
    phoneNumber: '',
    city: '',
    neighborhood: '',
    fullName: '',
    photoURL: '',
  });

  const [message, setMessage] = useState('¿Está disponible el producto?');
  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState(null);
  const [nombre, setNombre] = useState('');
  const [photo, setPhoto] = useState('');

  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(true);
  const [disableInput, setDisableInput] = useState(true);

  const handleSubmitChat1 = async (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      socket.emit('message', { message, uid, nombre, photo });
      const newMessage = { body: message, from: 'Me' };
      setMessages([...messages, newMessage]);
      setInitialMessageSent(true);
      setIsOtherUserTyping(false);
      if (initialMessageSent && message.from !== 'Me') {
        setDisableInput(false);
      }
    }
    setMessage('');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, 'products', postId);
      const docSnap = await getDoc(docRef);
      const datos = docSnap.data();
      const uid = datos.uid;
      setUid(uid);

      const userdocRef = doc(db, 'users', uid);
      const userdocSnap = await getDoc(userdocRef);
      const userDatos = userdocSnap.data();
      setUser({
        ...userDatos,
      });

      const docRf = doc(db, 'users', uidd);
      const docSnp = await getDoc(docRf);
      const userInfo = docSnp.data();
      setNombre(userInfo.userName.split(' ')[0]);
      setPhoto(userInfo.photoURL.downloadURL || userInfo.photoURL);
    };

    fetchUser();

    const receiveMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      if (message.from !== 'Me') {
        setIsOtherUserTyping(true);
      }
    };

    socket.on('message', receiveMessage);

    return () => {
      socket.off('message', receiveMessage);
    };
  }, [postId, uidd, uid]);

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('Se presionó Enter');
      handleSubmitChat1(e);
    }
  };
 

  return (
    <div className="shadow-lg rounded-lg">
      <div
        id="container"
        className="w-[100%] max-w-[750px] bg-white m-auto border-gray-600 border shadow-lg rounded-lg"
      >
        <div className="shadow-md shadow-gray-700/50">
          <div className="grid pt-3 w-24 text-left mr-[100%] grid-cols-2">
            <img
              src={photo || photoURL}
              className="rounded-full ml-2 mb-2 cursor-pointer h-12"
            />
            <span className="font-semibold text-lg text-black mr-[80%] pl-4 pt-1 cursor-pointe gap-2">
              {nombre}
              <p className="text-xs text-gray-500 pl-1">privada</p>
            </span>
          </div>
        </div>

        <div className="relative w-[100%] bg-gray-200 md:h-[340px] sm:h-[300px] xl:h-[360px] overflow-auto scrollbar-thin scrollbar-thumb-thin pt-[10px] pr-[30px] pl-[30px] pb-[20px] shadow-gray-500 overflow-x-hidden border border-gray-300">
          <br />
          <div className="flex justify-center items-center">
            <img
              className="absolute w-10 h-10 rounded-full cursor-pointer top-2"
              src={user.photoURL.downloadURL || user.photoURL}
            />
            <span className="absolute font-semibold text-lg top-12 text-gray-600">
              <p>{user.userName.split(' ')[0]}</p>
            </span>
          </div>
          <div className="mt-24">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-max max-sm:text-sm my-2 p-2 table text-sm pr-4 pl-4 pb-2 ${
                  message.from === 'Me'
                    ? 'mr-1 bg-gray-800 ml-auto rounded-l-xl rounded-b-xl font-semibold text-white'
                    : 'bg-white rounded-r-xl rounded-b-xl font-semibold text-black'
                }`}
              >
                <div>{message.body || message}</div>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmitChat1}>
          <div className="flex justify-between max-h-[81px] w-[100%] pl-1 pr-1 mt-2">
            <textarea
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyDown={handleInputKeyDown}
              placeholder="Type something..."
              className="text-[18px] w-full mx-1 px-4 border-transparent mb-2 h-8 pt-1 xl:w-[90%] max-sm:w-[70%] placeholder:max-sm:text-[11px] bg-gradient-to-r from-gray-300 to-gray-200 text-black placeholder-gray-500 text-sm rounded-md block p-2.5 shadow-md shadow-gray-700/50 hover:border-transparent focus:border-transparent outline-none caret-gray-700 focus:ring-gray-100 focus:border-gray-100"
              style={{ resize: 'none', overflow: 'hidden' }}
              disabled={initialMessageSent && !isOtherUserTyping && disableInput}

              
            />
            <button
              type="submit"
              className="bottom-none pr-[14px] border-white mb-2 text-white cursor-pointer bg-gradient-to-r from-gray-300 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-md h-8 shadow-md shadow-gray-700/50 ml-2 max-sm:w-[100%]"
              disabled={initialMessageSent && !isOtherUserTyping && disableInput}
            >
              <img className="ml-2" src={Send} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Chats;