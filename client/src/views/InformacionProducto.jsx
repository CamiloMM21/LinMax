import React, { useState, useEffect, useContext } from "react";
import NavbarAndSidebar from "../components/NavbarAndSidebar";
import NotificationCounter from "../components/menssages/NotificationCounter";
import BotonAbrirModal from "../components/Chat/BotonAbrirModal";
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
import "react-toastify/dist/ReactToastify.css";
import getPastTime from "../components/comments/comments";
import { ToastContainer } from "react-toastify";

function InformacionProducto() {
  // CONTEXTO DONDE ESTA GUARDADA LA INFORMACION DEL USUARIO EN SESION
  const userInfo = useContext(AuthContext).currentUser;

  const navigate = useNavigate();
  const location = useLocation();

  //  ID DEL POST PREVIAMENTE ENVIADO POR MISPUBLICACIONES
  const PostId = location.state;

  const [product, setProduct] = useState({
    id: "",
    title: "",
    description: "",
    category: "",
    price: "",
    location: "",
    rating: 0,
    comments: 0,
    uid: "",
  });

  const [currentUserRatingValue, setCurrentUserRatingValue] = useState(-1);

  const [comment, setComment] = useState([]);

  const [userPhoto, setUserPhoto] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "products", PostId);
      const docSnap = await getDoc(docRef);
      const product = docSnap.data();
      setProduct({
        ...product,
        id: docSnap.id
      });

      // REFERENCIA AL DOCUMENTO DE RATINGS CON EL ID DEL PRODUCTO
      const ratingsDocRef = doc(db, "ratings", PostId);

      // REFERENCIA A LA COLECCION UserRatings DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
      const userRatingsColRef = collection(ratingsDocRef, "userRatings");

      const currentUserRatingDoc = await getDoc(
        doc(userRatingsColRef, userInfo.uid)
      );
      if (currentUserRatingDoc.exists()) {
        setCurrentUserRatingValue(currentUserRatingDoc.data().value);
      } else {
        setCurrentUserRatingValue(null);
      }

      const historyDocRef = doc(db, "history", userInfo.uid);
      const userHistoryColRef = collection(historyDocRef, "productHistory");
      const existingHistory = await setDoc(doc(userHistoryColRef, product.id),
        {
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
          location: product.location,
          rating: product.rating,
          uid: userInfo.uid,
          img: product.img,
          timeStamp: serverTimestamp()
        });

      // REFERENCIA AL DOCUMENTO DE ProductCommets CON EL ID DEL PRODUCTO
      const productCommentsDocRef = doc(db, "productComments", product.id);

      // REFERENCIA A LA COLECCION UserComments DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
      const userCommentsColRef = collection(
        productCommentsDocRef,
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

  const [selectedIndex, setSelectedIndex] = useState(-1);

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
      // REFERENCIA AL DOCUMENTO DE ProductCommets CON EL ID DEL PRODUCTO
      const productCommentsDocRef = doc(db, "productComments", product.id);

      // REFERENCIA A LA COLECCION UserComments DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
      const userCommentsColRef = collection(
        productCommentsDocRef,
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

      // OBTENER TODOS LOS DOCUMENTOS DE LA COLECCION ProductComments DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
      const queryAllUsersComments = await getDocs(userCommentsColRef);

      // INICIALIZACION DE LA CANTIDAD DE DOCUMENTOS DENTRO DE LA COLECCION
      var amountComments = queryAllUsersComments.size;

      // ACTUALIZAMOS EL CAMPO COMMENTS DEL PRODUCTO
      await setDoc(doc(db, "products", product.id), {
        ...product,
        comments: amountComments,
      });

      // ACTUALIZAMOS EL USESTATE PRODUCT CON EL CAMPO COMMENTS
      setProduct({
        ...product,
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
      // REFERENCIA AL DOCUMENTO DE ProductCommets CON EL ID DEL PRODUCTO
      const productCommentsDocRef = doc(db, "productComments", product.id);

      // REFERENCIA A LA COLECCION UserComments DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
      const userCommentsColRef = collection(
        productCommentsDocRef,
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

    // REFERENCIA AL DOCUMENTO DE ProductCommets CON EL ID DEL PRODUCTO
    const productCommentsDocRef = doc(db, "productComments", product.id);

    // REFERENCIA A LA COLECCION UserComments DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
    const userCommentsColRef = collection(
      productCommentsDocRef,
      "userComments"
    );

    // ELIMINAMOS EL COMENTARIO
    await deleteDoc(doc(userCommentsColRef, commentId));

    // OBTENER TODOS LOS DOCUMENTOS DE LA COLECCION ProductComments DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
    const queryAllUsersComments = await getDocs(userCommentsColRef);

    // INICIALIZACION DE LA CANTIDAD DE DOCUMENTOS DENTRO DE LA COLECCION
    var amountComments = queryAllUsersComments.size;

    // ACTUALIZAMOS EL CAMPO COMMENTS DEL PRODUCTO
    await setDoc(doc(db, "products", product.id), {
      ...product,
      comments: amountComments,
    });

    // ACTUALIZAMOS EL USESTATE PRODUCT CON EL CAMPO COMMENTS
    setProduct({
      ...product,
      comments: amountComments,
    });

    // RECARGAR LA PAGINA
    window.location.reload();
  };

  return (
    <div>
      <NavbarAndSidebar />
      <div className=" w-auto pl-[220px] max-sm:pl-[2px] h-[100vh] bg-bggray text-center pt-[113px]">
        <div>
          <h1
            style={titleStyle}
            className="text-4xl font-bold mb-4 text-slate-100 "
          >
            <p id="p">
              <span className="span mr-[20px]">
                Informacion sobre el producto
              </span>
            </p>
          </h1>
          <div className="flex pl-[45px]  pt-6 ">
            <div className="">
              <img
                src={product.img}
                alt=""
                className="w-[280px] border-orange-100 border-opacity-5 border-8 rounded-md"
              />
            </div>
            <div className="text-right  pt-8 md:pl-[60%] max-sm:pl-[10%] pr-4 ">
              <h3>
                <p className="text-blue-600 font-extrabold text-md pb-[20px]  text-left">
                  Si deseas contactarse con el vendedor
                </p>
              </h3>
              <div className="mr-16">
                <BotonAbrirModal texto="Comunicarse" postId={PostId} />
              </div>
            </div>
          </div>
          <h2 className="text-gray-200 text-left pl-14 pt-4 font-black">
            {product.title}
          </h2>
          <div className="text-blue-500 text-left pl-14 font-semibold">
            <a
              onClick={() =>
                navigate("/menu/info/perfilvendedor", { state: product.id })
              }
              className="cursor-pointer underline hover:text-underline-thickness-2"
            >
              Perfil vendedor...
            </a>
          </div>
          <div className="flex text-gray-200 text-left pl-14 pt-4 font-black flex-row ">
            {Math.round(product.rating * 10) / 10}
            {Array.from({ length: 5 }, (_, index) => (
              <svg
                key={index}
                aria-hidden="true"
                className="w-5 h-5 text-yellow-400 ml-1 mt-0"
                fill={
                  // currentUserRatingValue ? "#facc15" :
                  index < selectedIndex
                    ? "#facc15"
                    : index < currentUserRatingValue
                      ? "#facc15"
                      : "#e4e4e4"
                }
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                onMouseEnter={() => setCurrentUserRatingValue(index + 1)}
                onMouseLeave={() => setCurrentUserRatingValue(-1)}
                onClick={() => {
                  setSelectedIndex(index + 1);

                  // INFORMACION A GUARDAR AL DARLE CLICK A DETERMINADA ESTRELLA
                  const userRating = { uid: userInfo.uid, value: index + 1 };
                  const handleCreateRating = async () => {
                    try {
                      // REFERENCIA AL DOCUMENTO DE RATINGS CON EL ID DEL PRODUCTO
                      const ratingsDocRef = doc(db, "ratings", product.id);

                      // REFERENCIA A LA COLECCION UserRatings DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
                      const userRatingsColRef = collection(
                        ratingsDocRef,
                        "userRatings"
                      );

                      // GUARDAMOS LA INFORMACION PREVIAMENTE CAPTURADA AL DAR CLICK EN UNA ESTRELLA
                      const existingRating = await setDoc(
                        doc(userRatingsColRef, userInfo.uid),
                        {
                          uid: userRating.uid,
                          value: userRating.value,
                        }
                      );

                      // OBTENER TODOS LOS DOCUMENTOS DE LA COLECCION UserRatings DENTRO DEL DOCUMENTO PREVIAMENTE REFERENC
                      const queryAllUsersRatings = await getDocs(
                        userRatingsColRef
                      );

                      // INICIALIZACION DE LA SUMA DE VALORES
                      var sumValues = 0;


                        // sumUids = 4
                        // sumvalues = 5
                        // sumvalues = 17

                      // INICIALIZACION DE LA CANTIDAD DE DOCUMENTOS DENTRO DE LA COLECCION
                      var sumUids = queryAllUsersRatings.size;

                      // POR CADA DOCUMENTO QUE HAYA VA A SUMAR LOS VALORES Y LOS GUARDARÁ EN sumValues
                      queryAllUsersRatings.forEach((doc) => {
                        sumValues += doc.data().value;
                      });

                      // RATING FINAL DE LA PUBLICACION
                      var rating = sumValues / sumUids;

                      // ACTUALIZAMOS EL RATING DEL PRODUCTO
                      await setDoc(doc(db, "products", product.id), {
                        ...product,
                        rating: rating,
                      });

                      // ACTUALIZAMOS EL USESTATE PRODUCT CON EL RATING
                      setProduct({
                        ...product,
                        rating: rating,
                      });
                    } catch (err) {
                      console.log(err);
                    }
                  };
                  handleCreateRating();
                  // alert(`Clicked star ${index + 1}`);
                }}
              >
                <title>Star</title>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}
          </div>
          <p className="text-white ml-72 w-[50%]  pb-6 font-semibold order-2 text-md whitespace-pre-line">
            {`Esta es toda la informacion del producto: ${product.description}`}
          </p>
          <div className="bg-gray-700 w-auto pb-4 h-auto items-center ml-[60px] mr-[20px] rounded-xl gap-6 px-4 py-4 mb-6 ">
            <input
              type="text"
              className="bg-gray-600 cursor-text  border-none gap-2 w-full text-gray-200 font-semibold gap-2"
              placeholder="titulo"
              readOnly
              value={`Titulo:  ${product.title}`}
            />
            <br />
            <input
              type="text"
              className="bg-gray-500 cursor-text cursor-ponter border-none gap-2 w-full text-gray-800 font-semibold "
              placeholder="titulo"
              readOnly
              value={`Descripción:  ${product.description}`}
            />
            <br />
            <input
              type="text"
              className="bg-gray-600 cursor-text border-none gap-2 w-full text-gray-200 font-semibold gap-2"
              placeholder="titulo:"
              valor="sasa"
              readOnly
              value={`Precio: ${product.price}`}
            />
            <br />
            <input
              type="text"
              className="bg-gray-500 cursor-text border-none gap-2 w-full text-gray-800 font-semibold gap-2"
              placeholder="titulo"
              value={`Ubicación:  ${product.location}`}
              readOnly
            ></input>{" "}
          </div>
          <div className="bg-gray-700 w-auto pb-4 h-auto items-center ml-[60px] mr-[20px] rounded-xl ">
            <h2 className="text-white font-semibold text-xl text-left pl-2 pt-2 ml-2">
              Productos relacionados
            </h2>
            <Check postId={PostId} />
            {/* <h1 className=" pt-44 font-extrabold text-gray-500 text-xl">
              no hay referencias
            </h1> */}
          </div>
          <div className="bg-gray-700 w-auto p-2 pr-6 pb-4 mb-10 items-center mt-4 ml-[60px] mr-[20px] rounded-xl grid auto-rows-auto">
            <h2 className="text-white font-semibold text-xl text-left pt-2 ml-2">
              Comentarios
            </h2>
            <h2 className="text-white text-sm text-left pt-2 ml-2">
              {product.comments} Comentarios
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
                  className={
                    'flex flex-row rounded-lg items-center mt-4 ml-2 pl-4 p-2 hover:bg-slate-600'
                  }
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
          <div>&nbsp;</div>
        </div>
      </div>
      <NotificationCounter postId={PostId} />
      <ToastContainer className="toastWidth" />
    </div>
  );
}

export default InformacionProducto;