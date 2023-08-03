import React, { useEffect, useState } from 'react';
import NavbarAndSidebar from "../components/NavbarAndSidebar";
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../database/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Img } from "../components/assets/Img.svg";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPlayer from 'react-player';
import { FaFileVideo } from 'react-icons/fa';


function PublicarVideos() {
  const [videoUrl, setVideoUrl] = useState("");
  const [perc, setPerc] = useState(null);
  const [file, setFile] = useState("");
  const [validation, setValidation] = useState(false);
  const userInfo = useContext(AuthContext).currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const uploadVideo = async () => {
      const storageRef = ref(storage, "videos/" + new Date().getTime());
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
            setVideoUrl(downloadURL);
          });
        }
      );
    };

    if (file) {
      uploadVideo();
    }
  }, [file]);

  const misPublicacionesView = () => {
    navigate("/misVideos");
  };

  const handleCreate = async (values) => {
    const videosList = {
      title: values.title,
      description: values.description,
      location: values.location,
    };

    try {
      await addDoc(collection(db, "videos"), {
        uid: userInfo.uid,
        ...videosList,
        url: videoUrl,
        timeStamp: serverTimestamp(),
      });

      toast.success("Publicación exitosa!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        onClose: () => {
          setTimeout(() => {
            misPublicacionesView();
          }, 4500);
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const validar = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = "Titulo obligatorio";
    } else if (!values.description) {
      errors.description = "Descripción obligatoria";
    } else if (values.description.length < 11) {
      errors.description = "La descripción debe ser mayor a 10 dígitos";
    } else if (values.description.length > 69) {
      errors.description = "La descripción debe ser menor a 70 dígitos";
    } else if (!videoUrl) {
      errors.url = "Video obligatorio";
    } else if (!values.location) {
      errors.location = "Ubicación obligatoria";
    }
    return errors;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const resetUpload = () => {
    setVideoUrl("");
    setPerc(null);
    setFile("");
  };

  return (
    <div>
      <NavbarAndSidebar />
      <div className="p-4 pt-10 bg-bggray h-screen sm:ml-64">
        <div className="p-4 px-10 pt-8 mt-14">
          <div className="flex items-center justify-center h-10 mb-4 rounded">
            <p className="text-4xl text-white dark:text-gray-500">Publicar video</p>
          </div>
          <div className="flex items-center justify-center h-full p-5 py-10 mb-4 rounded-xl bg-gray-700">
            <div className="grid auto-rows-auto gap-10">
              <Formik
                initialValues={{
                  title: "",
                  description: "",
                  url: "",
                  location: "",
                }}
                onSubmit={handleCreate}
                validate={validar}
              >
                {({ errors }) => (
                  <Form>
                    <div className="grid grid-cols-2 gap-5 mb-4">
                      <div className="grid auto-rows-auto gap-3">
                        <Field
                          name="title"
                          type="text"
                          className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="Titulo"
                        />

                        <div className="flex items-center justify-center">
                          {/* Agregar la barra de carga y el texto dinámico */}
                          {perc !== null && perc < 100 && (
                            <div className="flex items-center justify-center mt-4">
                              <div className="w-64 bg-gray-300 rounded">
                                <div className="h-2 bg-blue-500 rounded" style={{ width: `${perc}%` }}></div>
                              </div>
                              <p className="ml-4 text-gray-500">{Math.floor(perc)}% cargado</p>
                            </div>
                          )}
                          {videoUrl && (
                            <div className="video-wrapper">
                              <ReactPlayer
                                url={videoUrl}
                                width="380px"
                                height="190px"
                                controls
                                controlsList="download"
                                playing
                              />
                            </div>
                          )}
                        </div>
                        {perc === 100 && (
                          <div className="flex justify-center mt-4">
                            <button
                              type="button"
                              className="btn bg-red-500 hover:bg-red-700 text-white"
                              onClick={resetUpload}
                            >
                              Eliminar video
                            </button>
                          </div>
                        )}

                        {!videoUrl && (
                          <label htmlFor="file" className="flex text-gray-300 text-sm w-20 p-2.5 h-10">
                            <p>Video: </p>
                            <FaFileVideo className="w-6 h-6 cursor-pointer" />
                            <input
                              id="file"
                              name="file"
                              type="file"
                              accept="video/*"
                              onChange={handleFileChange}
                              className="hidden w-4"
                            />
                          </label>
                        )}

                        {videoUrl && (
                          <div className="flex justify-center mt-4">
                            <p className="text-red-500 font-bold">
                              Si el video que subistes lo quieres cambiar, primero debes eliminar el video.
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="grid auto-rows-auto gap-5">
                        <Field
                          as="textarea"
                          name="description"
                          className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-auto"
                          placeholder="Descripcion"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <Field
                            name="location"
                            type="text"
                            className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-10"
                            placeholder="Ubicación"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 mb-4 flex justify-center text-red-600 font-bold">
                      <div className="flex flex-col">
                        <div>
                          {errors.title && <span>{errors.title}</span>}
                        </div>
                        <div>
                          {errors.description && <span>{errors.description}</span>}
                        </div>
                        <div>
                          {errors.url && <span>{errors.url}</span>}
                        </div>
                        <div>
                          {errors.location && <span>{errors.location}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <button disabled={perc !== null && perc < 100} type="submit" className="btn h-10 w-24">
                        Enviar
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer className="toastWidth" />
    </div>
  );
}
export default PublicarVideos;