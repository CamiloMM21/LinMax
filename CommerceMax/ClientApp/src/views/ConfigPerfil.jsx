import React from "react";
import Configuracion from "../components/configuracion/Configuracion";
import NotificationCounter from "../components/menssages/NotificationCounter";
import NavbarAndSidebar from "../components/NavbarAndSidebar";
import { ToastContainer } from "react-toastify";

function ConfigPerfil() {
  return (
    <div>
      <NavbarAndSidebar />
      <div className=" w-auto pl-[252px] max-sm:pl-[2px] h-screen bg-bggray text-center pt-[80px]">
        <Configuracion />
      </div>
      <NotificationCounter />
      <ToastContainer className="toastWidth" />
    </div>
  );
}

export default ConfigPerfil;
