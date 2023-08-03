import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ReactComponent as Hom } from "./assets/Hom.svg";
import { ReactComponent as Pub } from "./assets/Pub.svg";
import { ReactComponent as Per } from "./assets/Per.svg";
import { ReactComponent as Sell } from "./assets/Sell.svg";
import { ReactComponent as Cate } from "./assets/Cate.svg";
import { ReactComponent as Favor } from "./assets/Favor.svg";
import { ReactComponent as Hist } from "./assets/Hist.svg";
import { ReactComponent as Buz } from "./assets/Buz.svg";
import { ReactComponent as Conf } from "./assets/Conf.svg";
import { ReactComponent as Log } from "./assets/Log.svg";
import { ReactComponent as Help } from "./assets/Help.svg";
import { ReactComponent as Eveno } from "./assets/Eveno.svg";
import { Dropdown } from "flowbite";
import Buscar from "./Buscar";
import { db } from "../database/firebase";
import { doc, getDoc } from "firebase/firestore";
import ReportButton from "./ReportButton";

function NavbarAndSidebar() {
  function DropdownUserInfo() {
    // set the target element that will be collapsed or expanded (eg. navbar menu)
    const $targetEl = document.getElementById("dropdown-user");

    const $targetEl2 = document.getElementById("userDropdown");

    // options with default values
    const options = {
      placement: "bottom",
      triggerType: "click",
      offsetSkidding: 0,
      offsetDistance: 10,
      delay: 100,
    };

    let collapse = new Dropdown($targetEl, $targetEl2, options);

    // show the target element
    collapse.toggle();
  }

  const navigate = useNavigate();
  const location = useLocation();

  const { dispatch } = useContext(AuthContext);

  const menuView = () => {
    navigate("/menu");
  };

  const favoritosView = () => {
    navigate("/favoritos");
  };

  const historialView = () => {
    navigate("/historial");
  };

  const categoriasView = () => {
    navigate("/categorias");
  };

  const miPerfilView = () => {
    navigate("/miperfil");
  };

  const misPublicacionesView = () => {
    navigate("/publicaciones");
  };

  const venderView = () => {
    navigate("/vender");
  };

  const buzon = () => {
    navigate("/buzon");
  };

  const configuracionperfil = () => {
    navigate("/config");
  };

  const ayudaView = () => {
    navigate("/ayuda");
  };

  const [showReport, setShowReport] = useState(false);

  const handleReportClick = () => {
    setShowReport(true);
  };
  const handleDownloadComplete = () => {
    setShowReport(false);
  };

  const logOut = () => {
    // Eliminar el token de sesión del localStorage
    dispatch({ type: "LOGOUT" });
  };

  const userInfo = useContext(AuthContext);
  const [photoURL, setphotoURL] = useState("");

  const uid = userInfo.currentUser.uid;

  useEffect(() => {
    const obtenerDatos = async () => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      const userInfo = docSnap.data();
      setphotoURL(userInfo.photoURL.downloadURL);
    };
    obtenerDatos();
  }, [uid]);
  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-bggray border-b border-gray-500">
        <div className="px-3 py-5 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <Eveno />
              </button>
              <a href="http://localhost:3000/menu" className="flex md:mr-24">
                <img
                  className="h-10 mr-3"
                  src="/img/flor.png"
                  alt="Comemerce Max Logo"
                  width="42"
                />
                <span className="self-center text-xl text-white font-semibold sm:text-2xl whitespace-nowrap">
                  Commerce Max
                </span>
              </a>
            </div>
            <Buscar />

            <div className="flex items-center">
              <div className="flex items-center ml-3">
                <div>
                  <button
                    type="button"
                    id="userDropdown"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-600"
                    aria-expanded="false"
                    onClick={DropdownUserInfo}
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="w-10 h-10 rounded-full"
                      src={userInfo.currentUser.photoURL || photoURL}
                      alt="user photo"
                    />
                  </button>
                </div>
                <div
                  className="z-50 hidden my-4 text-base list-none bg-bggray divide-y divide-gray-600 rounded shadow"
                  id="dropdown-user"
                >
                  <div className="px-4 py-3" role="none">
                    <p className="text-sm text-white" role="none">
                      {userInfo.currentUser.displayName}
                    </p>
                    <p
                      className="text-sm font-medium text-gray-300 truncate"
                      role="none"
                    >
                      {userInfo.currentUser.email}
                    </p>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <a
                        onClick={miPerfilView}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                        role="menuitem"
                      >
                        Mi Perfil
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={misPublicacionesView}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                        role="menuitem"
                      >
                        Mis Publicaciones
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={configuracionperfil}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                        role="menuitem"
                      >
                        Configuración
                      </a>
                    </li>
                    <div>
                    
                        <li>
                          <a
                            onClick={handleReportClick}
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                            role="menuitem"
                          >
                            Reporte
                          </a>
                        </li> 
                        {showReport && <ReportButton />}
                    </div>
                    <li>
                      <a
                        onClick={logOut}
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer"
                        role="menuitem"
                      >
                        Log Out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-24 transition-transform -translate-x-full bg-bggray border-r border-gray-500 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-bggray">
          <ul className="space-y-2">
            <li>
              <a
                onClick={menuView}
                className={`${
                  location.pathname === "/menu" ||
                  location.pathname === "/menu/info" ||
                  location.pathname === "/menu/info/perfilvendedor"
                    ? "text-red-600 font-bold"
                    : ""
                } flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-gray-700 cursor-pointer`}
              >
                <Hom />
                <span className="ml-3">Menú Principal</span>
              </a>
            </li>
            <li>
              <a
                onClick={misPublicacionesView}
                className={`${
                  location.pathname === "/publicaciones" ||
                  location.pathname === "/publicaciones/administrar"
                    ? "text-red-600 font-bold"
                    : ""
                } flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-gray-700 cursor-pointer`}
              >
                <Pub />
                <span className="ml-3">Mis Publicaciones</span>
              </a>
            </li>
            <li>
              <a
                onClick={miPerfilView}
                className={`${
                  location.pathname === "/miperfil"
                    ? "text-red-600 font-bold"
                    : ""
                } flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-gray-700 cursor-pointer`}
              >
                <Per />
                <span className="ml-3">Mi Perfil</span>
              </a>
            </li>
            <li>
              <a
                onClick={venderView}
                className={`${
                  location.pathname === "/vender"
                    ? "text-red-600 font-bold"
                    : ""
                } flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-gray-700 cursor-pointer`}
              >
                <Sell />
                <span className="flex-1 ml-3 whitespace-nowrap">Vender</span>
              </a>
            </li>
            <li>
              <a
                onClick={categoriasView}
                className={`${
                  location.pathname === "/categorias" ||
                  location.pathname === "/categorias/mostrarcategorias"
                    ? "text-red-600 font-bold"
                    : ""
                } flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-gray-700 cursor-pointer`}
              >
                <Hist />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Categorias
                </span>
              </a>
            </li>
            <li>
              <a
                onClick={favoritosView}  
                className={`${ location.pathname === "/favoritos" ? "text-red-600 font-bold" : "" } flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-gray-700 cursor-pointer`}>
                <Favor />
                <span className="flex-1 ml-3 whitespace-nowrap">Favoritos</span>
              </a>
            </li>
            <li>
              <a
                onClick={historialView}
                className={`${ location.pathname === "/historial" ? "text-red-600 font-bold" : "" } flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-gray-700 cursor-pointer`}
              >
                <Hist />
                <span className="flex-1 ml-3 whitespace-nowrap">Historial</span>
              </a>
            </li>
            <li>
              <a
                onClick={buzon}
                className={`${
                  location.pathname === "/buzon" ? "text-red-600 font-bold" : ""
                } flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-gray-700 cursor-pointer`}
              >
                <Buz />
                <span className="flex-1 ml-3 whitespace-nowrap">Buzon</span>
              </a>
            </li>
            <li>
              <a
                onClick={configuracionperfil}
                className={`${
                  location.pathname === "/config"
                    ? "text-red-600 font-bold"
                    : ""
                } flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-gray-700 cursor-pointer`}
              >
                <Conf />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Configuración
                </span>
              </a>
            </li>
            <li>
              <a
                onClick={ayudaView}
                className={`${
                  location.pathname === "/ayuda" ||
                  location.pathname === "/ayuda/sugerencia" ||
                  location.pathname === "/ayuda/pregunta"
                    ? "text-red-600 font-bold"
                    : ""
                } flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-gray-700 cursor-pointer`}
              >
                <Help />
                <span className="flex-1 ml-3 whitespace-nowrap">Ayuda</span>
              </a>
            </li>
            <li>
              <a
                onClick={logOut}
                className="flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-gray-700 cursor-pointer"
              >
                <Log />
                <span className="flex-1 ml-3 whitespace-nowrap">Log Out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default NavbarAndSidebar;
