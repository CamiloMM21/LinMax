import React, { useState } from "react";
import ModificarPerfilModal from "./ModificarPerfilModal";
import EliminarCuentaModal from "./EliminarCuentaModal";

function Configuracion() {
  const [activeButton, setActiveButton] = useState("modificarPerfil");

  const handleClick = (e) => {
    setActiveButton(e);
  };

  return (
    <div className="flex flex-row h-full bg-bggray ">
      <div className="flex flex-col w-64 bg-gray-700 border-r border-gray-800">
        <button
          onClick={() => handleClick("modificarPerfil")}
          className={`p-4 text-left font-bold text-white ${
            activeButton === "modificarPerfil" ? "bg-red-700" : " text-gray-200"
          }`}
        >
          Modificar perfil
        </button>

        <button
          onClick={() => handleClick("eliminarCuenta")}
          className={`p-4  text-left font-bold text-white ${
            activeButton === "eliminarCuenta" ? "bg-red-700" : "text-gray-200"
          }`}
        >
          Eliminar cuenta
        </button>
      </div>
      <div className="flex-1 p-8 ">
        {activeButton === "modificarPerfil" ? (
          <ModificarPerfilModal />
        ) : (
          <EliminarCuentaModal />
        )}
      </div>
    </div>
  );
}

export default Configuracion;
