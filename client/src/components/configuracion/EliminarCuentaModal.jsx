import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../database/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";

function EliminarCuentaModal() {

  const userInfo = useContext(AuthContext);
  const [eliminado, setEliminado] = useState(false);

  const navigate = useNavigate();
  const cancelar = () => {
    navigate("/menu")
  }

  const handleEliminarCuenta = async () => {
    try {
      // Eliminamos el documento del usuario autenticado
      await deleteDoc(doc(db, "users", userInfo.currentUser.uid))

      // Obtenemos los productos del usuario autenticado
      const productsQuery = query(collection(db, "products"), where("uid", "==", userInfo.currentUser.uid));
      const querySnapshot = await getDocs(productsQuery);
      querySnapshot.forEach(async (doc) => {
        const productsDocRef = doc.ref;

        // Eliminamos los productos del usuario autenticado
        await deleteDoc(productsDocRef);

        // Elimina el usuario autenticado de Firebase Authentication
        await auth.currentUser.delete();
      });

      // Cambia el estado de eliminado a true para activar la navegación
      setEliminado(true);
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error.message);
    }
  };

  if (eliminado) {
    // Si la cuenta se ha eliminado con éxito, navegamos a la página de inicio de sesión
    navigate("/");
    return null;
  }

  return (
    <div className="pt-10">
      <h2 className="text-4xl text-white dark:text-gray-500 h-10 mb-4">
        Eliminar cuenta
      </h2>
      <div className="flex flex-col justify-center items-center h-screen h-full p-5 py-10 mb-4 rounded-xl bg-gray-700  ">
        <p className="mb-4 font-bold gap-1 text-black text-xl">
          ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se
          puede deshacer.
        </p>
        <br />
        <div className="flex items-center justify-between gap-60 py-2 px-4 rounded mb-4">
          <button className="btnChange h-10 w-44 font-medium text-md cursor-pointer"
            onClick={handleEliminarCuenta}
          >
            Eliminar cuenta
          </button>
          <button onClick={cancelar} className="btnCancel h-10 w-26 font-medium text-md cursor-pointer">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EliminarCuentaModal;
