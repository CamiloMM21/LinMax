import React, { useState, useEffect, useContext } from "react";
import NavbarAndSidebar from "../components/NavbarAndSidebar";
import NotificationCounter from "../components/menssages/NotificationCounter";
import Check from "./info/Check";
import { useNavigate, useLocation } from "react-router-dom";
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc
} from "firebase/firestore";
import { db } from "../database/firebase";
import { AuthContext } from "../context/AuthContext";
import getPastTime from "../components/comments/comments";
import ReactPlayer from 'react-player';
import { ToastContainer } from "react-toastify";

function InformacionVideo() {
  // CONTEXTO DONDE ESTA GUARDADA LA INFORMACION DEL USUARIO EN SESION
  const userInfo = useContext(AuthContext).currentUser;
  
  const [videoUrl, setVideoUrl] = useState({
    id: "",
    title: "",
    description: "",
    location: "",
    comments: 0,
    uid: ""
  });

  const navigate = useNavigate();
  const location = useLocation();

  //  ID DEL POST PREVIAMENTE ENVIADO POR MISPUBLICACIONES
  const PostId = location.state;

  const [comment, setComment] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "videos", PostId);
      const docSnap = await getDoc(docRef);
      const videoUrl = docSnap.data();
      setVideoUrl({
        ...videoUrl,
        id: docSnap.id
      });

      // REFERENCIA AL DOCUMENTO DE VideoCommets CON EL ID DEL VIDEO
      const videoCommentsDocRef = doc(db, "videoComments", videoUrl.id);

      // REFERENCIA A LA COLECCION UserComments DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
      const userCommentsColRef = collection(
        videoCommentsDocRef,
        "userComments"
      );

      const commentList = [];

      // OBTENER TODOS LOS DOCUMENTOS DE LA COLECCION userComments DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
      const queryAllUsersComments = await getDocs(query(userCommentsColRef, orderBy("timeStamp", "asc")));
      queryAllUsersComments.forEach((doc) => {
        commentList.push({ id: doc.id, ...doc.data() });
      });
      setComment(commentList);
    };
    fetchData();
  }, []);

  const [photoURL, setphotoURL] = useState("");

  useEffect(() => {
    const obtenerDatos = async () => {
      const docRef = doc(db, "users", userInfo.uid);
      const docSnap = await getDoc(docRef);
      const uInfo = docSnap.data();
      setphotoURL(uInfo.photoURL.downloadURL);
    };
    obtenerDatos();
  }, [userInfo.uid]);

  const titleStyle = {
    textShadow: "0 0 0.2em #77c9ff, 0 0 0.2em #7780ff, 0 0 0.2em #7780ff",
  };

  const [showCommentButtons, setShowCommentButtons] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleCommentClick = () => {
    setShowCommentButtons(true);
  };

  const miPerfilView = () => {
    navigate("/miperfil");
  };

  // OBJETO CON UID Y COMNENTARIO
  const userComment = { uid: userInfo.uid, comment: commentText };

  // FUNCION QUE GUARDA EL OBJETO EN FIREBASE
  const handleCreateComment = async (e) => {
    e.preventDefault();
    try {
      // REFERENCIA AL DOCUMENTO DE VideoComments CON EL ID DEL VIDEO
      const videoCommentsDocRef = doc(db, "videoComments", videoUrl.id);

      // REFERENCIA A LA COLECCION UserComments DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
      const userCommentsColRef = collection(
        videoCommentsDocRef,
        "userComments"
      );

      // GUARDAMOS LA INFORMACION PREVIAMENTE CAPTURADA AL DAR CLICK EN COMENTAR
      const existingComment = await addDoc(userCommentsColRef, {
        uid: userComment.uid,
        userName: userInfo.displayName,
        userPhoto: userInfo.photoURL,
        comment: userComment.comment,
        timeStamp: serverTimestamp()
      });

      // OBTENER TODOS LOS DOCUMENTOS DE LA COLECCION VideoComments DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
      const queryAllUsersComments = await getDocs(userCommentsColRef);

      // INICIALIZACION DE LA CANTIDAD DE DOCUMENTOS DENTRO DE LA COLECCION
      var amountComments = queryAllUsersComments.size;

      // ACTUALIZAMOS EL CAMPO COMMENTS DEL VIDEO
      await setDoc(doc(db, "videos", videoUrl.id), {
        ...videoUrl,
        comments: amountComments,
      });

      // ACTUALIZAMOS EL USESTATE VIDEOURL CON EL CAMPO COMMENTS
      setVideoUrl({
        ...videoUrl,
        comments: amountComments,
      });

      // DEJAR DE MOSTRAR LOS BOTONES DE COMENTAR Y CANCELAR
      setShowCommentButtons(false);

      // PONER EL TEXTO DEL INPUT VACIO
      setCommentText("");

      // RECARGAR LA PAGINA
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  // FUNCION PARA EL BOTON CANCELAR AL MOMENTO DE COMENTAR
  const handleCommentCancel = () => {
    // DEJAR DE MOSTRAR LOS BOTONES DE COMENTAR Y CANCELAR
    setShowCommentButtons(false);

    // PONER EL TEXTO DEL INPUT VACIO
    setCommentText("");
  };

  // FUNCION PARA ACTUALIZAR EL TEXTO DEL MENTARIO AL MOMENTO DE ESCRIBIR
  const handleCommentChange = (e) => {
    // SE ACTUALIZA EL USESTATE AL MOMENTO DE ESCRIBIR
    setCommentText(e.target.value);
  };

  // USESTATE PARA EL MENÚ DESPLEGABLE
  const [dropdownOpen, setDropdownOpen] = useState({});

  // FUNCION PARA ELEGIR SI EL MENÚ DESPLEGABLE SE MUESTRA O NO
  const handleDropdownToggle = (commentId) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  // USESTATE AL MOMENTO DE EDITAR
  const [editingCommentId, setEditingCommentId] = useState(null);

  // USESTATE PARA GUARDAR EL NUEVO TEXTO
  const [editCommentText, setEditCommentText] = useState("");

  // FUNCION PARA ELEGIR SI SE ESTÁ EDITANDO O NO
  const handleEdit = (commentId, commentComment) => {
    // FUNCION PARA MOSTRAR EL TEXTO ORIGINAL
    setDropdownOpen((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));

    // SE ACTUALIZA EL USESTATE CON EL TEXTO DEL COMENTARIO ORIGINAL
    setEditCommentText(commentComment);

    // ACTUALIZAMOS EL USESTATE CON EL ID DEL COMENTARIO
    setEditingCommentId(commentId);
  };

  // FUNCION PARA ACTUALIZAR EL TEXTO DEL NUEVO COMENTARIO
  const handleEditCommentChange = (e) => {
    // SE ACTUALIZA EL USESTATE AL MOMENTO DE ESCRIBIR
    setEditCommentText(e.target.value);
  }

  // FUNCION PARA ACTUALIZAR EL COMENTARIO CON EL NUEVO TEXTO
  const handleEditCommentUpdate = async (commentId) => {
    try {
      // REFERENCIA AL DOCUMENTO DE VideoCommets CON EL ID DEL VIDEO
      const videoCommentsDocRef = doc(db, "videoComments", videoUrl.id);

      // REFERENCIA A LA COLECCION UserComments DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
      const userCommentsColRef = collection(
        videoCommentsDocRef,
        "userComments"
      );

      // GUARDAMOS LA INFORMACION PREVIAMENTE CAPTURADA AL DAR CLICK EN ACTUALIZAR
      await setDoc(doc(userCommentsColRef, commentId), {
        uid: userComment.uid,
        userName: userInfo.displayName,
        userPhoto: userInfo.photoURL,
        comment: editCommentText,
        timeStamp: serverTimestamp()
      });

      // RECARGAR LA PAGINA
      window.location.reload();
    } catch (err) {
      console.log(err)
    }
  }

  // FUNCION PARA EL BOTON CANCELAR AL MOMENTO DE ACTUALIZAR EL COMENTARIO
  const handleEditCommentCancel = () => {
    // SE ACTUALIZA EL USESTATE A NULL
    setEditingCommentId(null);
  }

  // FUNCION PARA ELIMINAR EL COMENTARIO
  const handleDelete = async (commentId) => {
    console.log("borrando... " + commentId);

    // REFERENCIA AL DOCUMENTO DE VideoCommets CON EL ID DEL VIDEO
    const videoCommentsDocRef = doc(db, "videoComments", videoUrl.id);

    // REFERENCIA A LA COLECCION UserComments DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
    const userCommentsColRef = collection(
      videoCommentsDocRef,
      "userComments"
    );

    // ELIMINAMOS EL COMENTARIO
    await deleteDoc(doc(userCommentsColRef, commentId));

    // OBTENER TODOS LOS DOCUMENTOS DE LA COLECCION VideoComments DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
    const queryAllUsersComments = await getDocs(userCommentsColRef);

    // INICIALIZACION DE LA CANTIDAD DE DOCUMENTOS DENTRO DE LA COLECCION
    var amountComments = queryAllUsersComments.size;

    // ACTUALIZAMOS EL CAMPO COMMENTS DEL VIDEO
    await setDoc(doc(db, "videos", videoUrl.id), {
      ...videoUrl,
      comments: amountComments,
    });

    // ACTUALIZAMOS EL USESTATE VIDEO CON EL CAMPO COMMENTS
    setVideoUrl({
      ...videoUrl,
      comments: amountComments,
    });

    // RECARGAR LA PAGINA
    window.location.reload();
  };

  return (
    <div>
      <NavbarAndSidebar />
      <div className="w-auto pl-[220px] max-sm:pl-[2px] h-[100vh] bg-bggray text-center pt-[113px] overflow-auto scrollbar-trigger ">
        <div>
          <h1 style={titleStyle} className="text-4xl font-bold mb-4 text-slate-100 ">
            <p id="p">
              <span className="span mr-[20px]">
                Informacion sobre el Video
              </span>
            </p>
          </h1>
          <div className="flex pl-[45px]  pt-6 ">
            {videoUrl && (
              <div className="video-wrapper">
                <ReactPlayer
                  url={videoUrl.url}
                  width="580px"
                  height="340px"
                  controls
                  controlsList="download"
                  playing
                />
              </div>
            )}
          </div>
          <div className="bg-gray-400 w-[580px] ml-[45px]">
            <h2 className=" text-left pl-14 pt-4 font-black text-black">
              Titulo: {videoUrl.title}
            </h2>
          </div>
          <div className="bg-gray-400 w-[580px] ml-[45px]">
            <h2 className="text-black text-left pl-14 pt-4 font-black">
              Descripcion:  {videoUrl.description}
            </h2>
          </div>
          <div className="bg-gray-700 w-auto p-2 pr-6 pb-4 mb-10 items-center mt-4 ml-[60px] mr-[20px] rounded-xl grid auto-rows-auto">
            <h2 className="text-white font-semibold text-xl text-left pt-2 ml-2">
              Comentarios
            </h2>
            <h2 className="text-white text-sm text-left pt-2 ml-2">
              {videoUrl.comments} Comentarios
            </h2>
            <form onSubmit={handleCreateComment}>
              <div className="flex justify-start">
                <button
                  type="button"
                  id="userDropdown"
                  className="flex text-sm bg-gray-800 mt-4 ml-2 rounded-full focus:ring-4 focus:ring-gray-600"
                  onClick={miPerfilView}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-10 h-10 rounded-full"
                    src={userInfo.photoURL || photoURL}
                    alt="user photo"
                  />
                </button>
                <input
                  name="title"
                  type="text"
                  className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 pt-2 pr-2 pb-2 mt-4 ml-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
                  placeholder="Añade un comentario..."
                  onClick={handleCommentClick}
                  value={commentText}
                  onChange={handleCommentChange}
                />
              </div>
              {showCommentButtons && (
                <div className="flex justify-start gap-10 ml-2 mt-5">
                  <button className="btnBlue" type="submit">
                    Comentar
                  </button>
                  <button className="btnDelete" onClick={handleCommentCancel}>
                    Cancelar
                  </button>
                </div>
              )}
            </form>
            {comment.map((comment) => {
              const isEditing = comment.id === editingCommentId;
              const isCurrentUserComment = comment.userName === userInfo.displayName;
              return (
                <div
                  key={comment.id}
                  className={'flex flex-row rounded-lg items-center mt-4 ml-2 pl-4 p-2 hover:bg-slate-600'}
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={comment.userPhoto}
                    alt="user photo"
                  />
                  <div className="flex flex-col ml-2">
                    <div className="flex justify-start text-gray-400">
                      <div>{comment.userName}</div>
                      <label className="mx-2 text-gray-300"> • </label>
                      <div>{getPastTime(comment.timeStamp)}</div>
                    </div>
                    {isEditing ? (
                      <div>
                        <input
                          name="comment"
                          type="text"
                          className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 pt-2 pr-2 pb-2 mt-4 ml-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
                          value={editCommentText}
                          onChange={handleEditCommentChange}
                        />
                        <div className="flex justify-start gap-10 ml-2 mt-5">
                          <button className="btnUpdate" onClick={() => { handleEditCommentUpdate(comment.id) }}>
                            Actualizar
                          </button>
                          <button className="btnDelete" onClick={() => { handleEditCommentCancel(comment.id) }}>
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-start text-white">
                        {comment.comment}
                      </div>
                    )}
                    {/* <div className="flex justify-start text-white">
                      {comment.comment}
                    </div> */}
                  </div>
                  {isCurrentUserComment && (
                    <div className="ml-auto relative">
                      <button
                        className="text-gray-400"
                        onClick={() => handleDropdownToggle(comment.id)}
                      >
                        <svg
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          className="w-6 h-6"
                        >
                          <path
                            clipRule="evenodd"
                            fillRule="evenodd"
                            d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                          ></path>
                        </svg>
                      </button>
                      {dropdownOpen[comment.id] && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-600 rounded-md shadow-lg">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <button
                              className="block px-4 py-2 text-sm text-white hover:bg-gray-500 w-full text-left"
                              role="menuitem"
                              onClick={() => { handleEdit(comment.id, comment.comment) }}
                            >
                              Editar
                            </button>
                            <button
                              className="block px-4 py-2 text-sm text-white hover:bg-gray-500 w-full text-left"
                              role="menuitem"
                              onClick={() => { handleDelete(comment.id) }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <NotificationCounter />
      <ToastContainer className="toastWidth" />
    </div>
  );
}
export default InformacionVideo