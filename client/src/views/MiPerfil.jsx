import React, { useContext, useState, useEffect } from "react";
import NavbarAndSidebar from "../components/NavbarAndSidebar";
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../database/firebase";
import NotificationCounter from "../components/menssages/NotificationCounter";
import { ToastContainer } from "react-toastify";

function MiPerfil() {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [barrio, setBarrio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [photoURL, setphotoURL] = useState("");
  const [email, setEmail] = useState("");

  const userContext = useContext(AuthContext);
  const uid = userContext.currentUser.uid;

  useEffect(() => {
    const obtenerDatos = async () => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      const userInfo = docSnap.data();
      setFullName(userInfo.fullName);
      setUserName(userInfo.userName);
      setEmail(userInfo.email);
      setPhoneNumber(userInfo.phoneNumber);
      setCity(userInfo.city); // este tambien
      setBarrio(userInfo.neighborhood); //esto bacio por el momento
      setphotoURL(userInfo.photoURL.downloadURL);
    };
    obtenerDatos();
  }, [uid]);

  return (
    <div>
      <NavbarAndSidebar />
      <div className="h-full">
        <div className="p-4 pt-10 bg-bggray min-h-screen sm:ml-64">
          <div className="p-4 px-10 pt-8 mt-14">
            <div className="flex items-center justify-center h-10 mb-4 rounded">
              <p className="text-4xl text-white dark:text-gray-500">
                Mi Perfil
              </p>
            </div>
            <div className="flex justify-center flex-wrap gap-5 h-full p-5 py-10 mb-4 rounded-xl bg-gray-700">
              <div className="grid auto-rows-auto gap-10">
                <form>
                  <div className="grid grid-cols-2 gap-5 mb-4">
                    <div className="grid auto-rows-auto gap-3">
                      <div className="flex items-center justify-center mr-32 shadow-gray-500 overflow-x-hidden  border-gray-300 border-opacity-5 border-8 rounded-md">
                        <img
                          src={photoURL || userContext.currentUser.photoURL}
                          className="w-80 h-72 rounded-md "
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="grid auto-rows-auto gap-3">
                      <p className="text-white text-xl p-1 font-bold">
                        Nombre: {fullName || userName}
                      </p>
                      <p className="text-white text-xl p-1 font-bold">
                        Correo: {email}
                      </p>
                      <p className="text-white text-xl p-1 font-bold ">
                        Telefono: {phoneNumber || "Sin información"}
                      </p>
                      <p className="text-white text-xl p-1 font-bold ">
                        Ciudad: {city || "Sin información"}
                      </p>
                      <p className="text-white text-xl p-1 font-bold ">
                        Barrio: {barrio || "Sin información"}
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NotificationCounter />
      <ToastContainer className="toastWidth" />
    </div>
  );
}

export default MiPerfil;