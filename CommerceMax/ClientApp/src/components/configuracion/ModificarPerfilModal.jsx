import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../database/firebase";
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore"; // importar las funciones necesarias para actualizar el documento
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { AuthContext } from "../../context/AuthContext";
import { ReactComponent as Img } from "../assets/Img.svg";
import "react-toastify/dist/ReactToastify.css";

function ModificarPerfilModal() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [fullName, setFullName] = useState("");

  const [photoURL, setphotoURL] = useState("");

  const userContext = useContext(AuthContext);
  const uid = userContext.currentUser.uid;
  const [lastUpdated, setLastUpdated] = useState(null);

  // USESTATE PARA DEFINIR EL ESTADO INICIAL DEL PORCENTAJE DE CARGA DE LA IMAGEN
  const [perc, setPerc] = useState(null);

  // USESTATE PARA DEFINIR EL ESTADO INICIAL DEL ARCHIVO
  const [file, setFile] = useState("");

  useEffect(() => {
    const obtenerDatos = async () => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      const userInfo = docSnap.data();
      setUserName(userInfo.userName);
      setNeighborhood(userInfo.neighborhood); //esto bacio por el momento
      setPhoneNumber(userInfo.phoneNumber);
      setCity(userInfo.city); // este tambien
      setFullName(userInfo.fullName);
      setphotoURL(userInfo.photoURL);
      setLastUpdated(userInfo.fechaDeActualizacion);
    };
    obtenerDatos();
  }, [uid]);

  const actualizarDatos = async () => {
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      userName: userName,
      neighborhood: neighborhood,
      phoneNumber: phoneNumber,
      city: city,
      fullName: fullName,
      photoURL: photoURL,
      fechaDeActualizacion: serverTimestamp(),
    });
  };

  const handleForm = (event) => {
    event.preventDefault();
    actualizarDatos();
    navigate("/menu");
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleBarrioChange = (event) => {
    setNeighborhood(event.target.value);
  };
  const handleTelefonoChange = (event) => {
    setPhoneNumber(event.target.value);
  };
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };
  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };
  const handleImagenChange = (event) => {
    setphotoURL(event.target.value);
  };

  // USEEFFECT PARA DEFINIR LAS ACCIONES AL MOMENTO DE QUE EXISTA UN ARCHIVO
  useEffect(() => {
    const uploadFile = () => {
      // NOMBRE DEL ARCHIVO, SE PONE CON EL DATE PARA EVITAR ERRORES DE IMAGENES CON EL MISMO NOMBRE
      const name = new Date().getTime() + file.name;

      // REFERENCIA DEL ARCHIVO
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // EVENTO PARA GENERAR LA URL DE NUESTRA IMAGEN CON CONSOLE LOG INDICANDO EL PROGRESO DE CARGA
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setphotoURL((prev) => ({ ...prev, downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const cancelar = (e) => {
    e.preventDefault();
    navigate("/menu");
  };
  return (
    <div className=" bg-bggray ">
      <div className="p-4  pt-2 mt-8">
        <div className="flex items-center justify-center h-10 mb-4 rounded">
          <p className="text-4xl text-white dark:text-gray-500">
            Modificar perfil
          </p>
        </div>
        <div className="flex items-center justify-center h-full p-5 py-10 mb-4 rounded-xl bg-gray-700">
          <div className="grid auto-rows-auto gap-10">
            <form>
              <div className="grid grid-cols-2 gap-5 mb-4">
                <div className="grid auto-rows-auto gap-3">
                  <div className="flex items-center justify-center mr-32 ">
                    <img
                      src={
                        file
                          ? URL.createObjectURL(file)
                          : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                      }
                      className="w-32 h-32 rounded-full"
                      alt=""
                    />
                  </div>

                  <label
                    htmlFor="file"
                    className="flex text-gray-300 text-sm block w-full p-2.5"
                  >
                    <a onClick={handleImagenChange}>Imagen: </a>
                    <Img />
                  </label>

                  <input
                    type="file"
                    id="file"
                    style={{ display: "none" }}
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
                <div className="grid auto-rows-auto gap-5">
                  <input
                    type="text"
                    onChange={handleFullNameChange}
                    className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 caret-blue-500"
                    placeholder=" Nombre completo"
                  />
                  <input
                    type="text"
                    onChange={handleUserNameChange}
                    className="bg-gray-600 border border-gray-500 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 caret-blue-500"
                    placeholder=" Nombre de usuario"
                  />

                  <input
                    type="text"
                    onChange={handleBarrioChange}
                    className="bg-gray-600 border border-gray-500 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 caret-blue-500"
                    placeholder=" barrio"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      onChange={handleTelefonoChange}
                      className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 caret-blue-500"
                      placeholder=" Teléfono"
                    />
                    <input
                      type="text"
                      onChange={handleCityChange}
                      className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 caret-blue-500"
                      placeholder=" Ciudad"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-24">
                <button
                  disabled={perc !== null && perc < 100}
                  className="btnChange h-10 w-38 font-medium text-md cursor-pointer"
                  onClick={handleForm}
                >
                  Guardar cambios
                </button>
                <button
                  disabled={perc !== null && perc < 100}
                  onClick={cancelar}
                  className="btnCancel h-10 w-26 font-medium text-md cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
            <p className="text-white font-bold">
              {" "}
              Última actualización:{" "}
              {lastUpdated ? lastUpdated.toDate().toLocaleDateString() : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModificarPerfilModal;
