import React from "react";
import NavbarAndSidebar from "../components/NavbarAndSidebar";
import Profile from "../components/perfil/Profile";
import NotificationCounter from "../components/menssages/NotificationCounter";
import { ToastContainer } from "react-toastify";

function PerfilVendedor() {
  return (
    <div className="w-full h-auto bg-bggray ">
      <NavbarAndSidebar />
      <div className="mt-[81px] max-sm:pl-2 pl-[256px] ">
        <Profile />
        <button></button>
        <div>
          <NotificationCounter />
        </div>
      </div>
      <ToastContainer className="toastWidth" />
    </div>
  );
}

export default PerfilVendedor;
