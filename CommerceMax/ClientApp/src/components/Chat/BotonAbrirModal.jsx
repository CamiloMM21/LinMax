import React, { useState, useContext, useEffect } from "react";
import MiComponente from "./MiComponente";
import { AuthContext } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../database/firebase";

const BotonAbrirModal = ({ texto, postId }) => {
  const userContext = useContext(AuthContext);
  const uuid = userContext.currentUser.uid;
  const [modalAbierto, setModalAbierto] = useState(false);
  const [uiid, setUiid] = useState(null); // CREA UNA VARIABLE DE ESTADO PARA GUARDAR EL UID

  const cerrarModal = () => {
    setModalAbierto(false);
  };


  useEffect(() => {
    // DEFINIMOS UNA FUNCION ASINCRONA QUE OBTENDRÁ EL DOCUMENTO QUE NECESITAMOS
    const fetchUser = async () => {
      // CONSULTA A DOCUMENTO PRODUCTS PARA OBTENER UID DE ESE POST
      const docRef = doc(db, "products", postId);
      const docSnap = await getDoc(docRef);
      const datos = docSnap.data();
      const uid = datos.uid;
      setUiid(uid);
    };

    fetchUser(); //LLAMAMOS LA FUNCIÓN fetchUser AL CARGAR EL COMPONENTE
  }, []);

  const handleClick = () => {
    toast.warn('Al enviar un mensaje deberas esperar a que el vendedor te responda', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      onClose: () => {
        setTimeout(() => {
          setModalAbierto(true);
        }, 6500)
      }
    });
  };

  return uuid == uiid ? (
    <p className="text-red-500">Es tu publicacion.</p>
  ) : (
    <div>
      <button
        onClick={handleClick}
        className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
      >
        {texto}
      </button>
      {modalAbierto && <MiComponente onClose={cerrarModal} PostId={postId} />}
    </div>
  );
};
export default BotonAbrirModal;
