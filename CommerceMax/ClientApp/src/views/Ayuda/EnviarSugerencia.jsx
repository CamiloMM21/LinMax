import React, { useEffect, useState } from 'react';
import NavbarAndSidebar from "../../components/NavbarAndSidebar";
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";
import { ReactComponent as Img } from "../../components/assets/Img.svg";
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../../database/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ToastContainer, toast } from 'react-toastify';


function EnviarSugerencia() {

    // USESTATE PARA DEFINIR EL ESTADO INICIAL DE IMAGE
    const [image, setImage] = useState({});

    // USESTATE PARA DEFINIR EL ESTADO INICIAL DEL ARCHIVO
    const [file, setFile] = useState("");

    // USESTATE PARA DEFINIR EL ESTADO INICIAL DEL PORCENTAJE DE CARGA DE LA IMAGEN
    const [perc, setPerc] = useState(null);

    // USEEFFECT PARA DEFINIR LAS ACCIONES AL MOMENTO DE QUE EXISTA UN ARCHIVO
    useEffect(() => {
        const uploadFile = () => {
            // NOMBRE DEL ARCHIVO, SE PONE CON EL DATE PARA EVITAR ERRORES DE IMAGENES CON EL MISMO NOMBRE
            const name = new Date().getTime() + file.name;

            // REFERENCIA DEL ARCHIVO
            const storageRef = ref(storage, name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            // EVENTO PARA GENERAR LA URL DE NUESTRA IMAGEN CON CONSOLE LOG INDICANDO EL PROGRESO DE CARGA
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    setPerc(progress)
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    console.log(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImage(() => ({ img: downloadURL }))
                        // const FileLink = {img: downloadURL};
                        // handleCreate((prev) => ({ ...prev, img: downloadURL }));
                    });
                }
            );
        }
        file && uploadFile();
    }, [file])

    // CONTEXTO DONDE ESTA GUARDADA LA INFORMACION DEL USUARIO EN SESION
    const userInfo = useContext(AuthContext).currentUser;

    const navigate = useNavigate();

    const menuView = () => {
        navigate("/menu");
    }

    const cancel = () => {
        navigate("/ayuda");
    }

    const handleCreate = async (values) => {
        const suggestionList = {
            title: values.title,
            description: values.description
        };
        try {
            await addDoc(collection(db, "suggestions"), {
                uid: userInfo.uid,
                ...suggestionList,
                ...image,
                timeStamp: serverTimestamp()
            });
            toast.success('Sugerencia exitosa!', {
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
                        menuView();
                    }, 4500)
                }
            });
        } catch (err) {
            console.log(err)
        }
    }

    // VALIDACIONES DEL FORMULARIO
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
        } else if (!image.img) {
            errors.img = "Archivo obligatorio";
        }
        return errors;
    }
    return (
        <div>
            <NavbarAndSidebar />

            <div className="p-4 pt-10 bg-bggray h-screen sm:ml-64">
                <div className="p-4 px-10 pt-8 mt-14">
                    <div className="flex items-center justify-center h-10 mb-4 rounded">
                        <p className="text-4xl text-white dark:text-gray-500">Enviar Sugerencia</p>
                    </div>
                    <div className="flex items-center justify-center h-full p-5 py-10 mb-4 rounded-xl bg-gray-700">
                        <div className="grid auto-rows-auto gap-10">
                            <Formik
                                initialValues={{
                                    title: "",
                                    description: "",
                                    img: "",
                                    category: "",
                                    price: "",
                                    location: ""
                                }}
                                onSubmit={handleCreate}
                                validate={validar}
                            >
                                <Form>
                                    <div className="grid grid-cols-6 gap-5 mb-4">
                                        <div className="col-start-1 col-end-2 w-16"></div>
                                        <div className="col-start-2 col-end-6">
                                            <div className="grid auto-rows-auto gap-3">
                                                <Field name="title" type="text" className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Titulo" />

                                                <Field as="textarea" name="description" className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Descripcion" />

                                                <div className="flex items-center justify-center">
                                                    <img src={file ? URL.createObjectURL(file) : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"} className="w-32 h-32 rounded-full" alt="" />
                                                </div>

                                                <label htmlFor="file" className="flex text-gray-300 text-sm block w-full p-2.5">
                                                    <p>Imagen: </p>
                                                    <Img />
                                                </label>

                                                <Field id="file" name="img" type="file" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
                                            </div>
                                        </div>
                                        <div className="col-start-6 col-end-7 w-16"></div>
                                    </div>
                                    <div className="mb-4 flex justify-center text-red-600 font-bold">
                                        <div className="flex flex-col">
                                            <div><ErrorMessage name="title" /></div>
                                            <div><ErrorMessage name="description" /></div>
                                            <div><ErrorMessage name="img" /></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center gap-24">
                                        <button onClick={cancel} className="btn h-10 w-26">Cancelar</button>
                                        <button disabled={perc !== null && perc < 100} type="submit" className="btn h-10 w-24">Enviar</button>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer className="toastWidth" />
        </div>
    )
}

export default EnviarSugerencia