import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../database/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../context/AuthContext';
import { ReactComponent as Mod } from "./assets/Mod.svg";
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../database/firebase';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from "flowbite";

function Signup() {
    const navigate = useNavigate();

    const menuView = () => {
        navigate("/menu");
    }

    const { dispatch } = useContext(AuthContext);

    const handleSignup = (values) => {
        createUserWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
                const user = userCredential.user;
                dispatch({ type: "LOGIN", payload: user });
                setDoc(doc(db, "users", user.uid), {
                    ...values,
                    timeStamp: serverTimestamp()
                })
                toast.success('Has creado tu cuenta!', {
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
                // menuView();
            })
            .catch((error) => {
                toast.error('Correo ya está en uso. Prueba con otro', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                console.log("errorCode: " + error.code);
                console.log("errorMessage: " + error.message);
            })
    }

    // VALIDACIONES DEL FORMULARIO
    const validar = (values) => {
        const errors = {}
        if (!values.email) {
            errors.email = "Correo obligatorio";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = "Correo inválido";
        } else if (!values.password) {
            errors.password = "Contraseña obligatoria";
        } else if (values.password.length < 8) {
            errors.password = "La contraseña debe ser mayor a 7 dígitos";
        } else if (!values.userName) {
            errors.userName = "Usuario obligatorio";
        } else if (!values.phoneNumber) {
            errors.phoneNumber = "Teléfono obligatorio";
        } else if (!values.city) {
            errors.city = "Ciudad obligatoria";
        } else if (!values.neighborhood) {
            errors.neighborhood = "Barrio obligatorio";
        } else if (!values.fullName) {
            errors.fullName = "Nombre Completo obligatorio";
        }
        return errors;
    }

    return (
        // SIGN UP MODAL
        <div id="signUpModal" tabIndex="-1" aria-hidden="true" className="fixed bg-black bg-opacity-25 backdrop-blur-sm top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
            <div className="relative w-full h-full max-w-2xl md:h-auto">
                {/* <!-- Modal content --> */}
                <div className="relative bg-bggray rounded-lg shadow">
                    {/* <!-- Modal header --> */}
                    <div className="flex items-start justify-between p-4 border-b rounded-t">
                        <h3 className="text-xl font-semibold text-white">
                            Sign Up
                        </h3>
                        <button id="signUpModalClose" type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                            <Mod />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    {/* <!-- Modal body --> */}
                    <div className="py-6 px-14">
                        <div className="flex justify-center">
                            <img src="./img/login-icon.svg" alt="login-icon" style={{ height: 7 + 'rem' }} />
                        </div>
                        <div className="text-center text-4xl font-bold text-white">Registrarse</div>
                        <div className="container">
                            <Formik
                                initialValues={{
                                    email: "",
                                    password: "",
                                    userName: "",
                                    phoneNumber: "",
                                    city: "",
                                    neighborhood: "",
                                    fullName: ""
                                }}
                                onSubmit={handleSignup}
                                validate={validar}
                            >
                                <Form>
                                    <div className="grid grid-flow-row auto-rows-max">
                                        <div className="grid grid-cols-2 gap-5">
                                            <div>
                                                <div className="mt-6 text-white">
                                                    <Field name="email" type="email" className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Correo" autoComplete="username" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="mt-6 text-white">
                                                    <Field name="password" type="password" className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Contraseña" autoComplete="new-password" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div>
                                                <div className="mt-3 text-white">
                                                    <Field name="userName" type="text" className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Usuario" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="mt-3 text-white">
                                                    <Field name="phoneNumber" type="number" className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Teléfono" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-5">
                                            <div>
                                                <div className="mt-3 text-white">
                                                    <Field name="city" type="text" className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Ciudad" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="mt-3 text-white">
                                                    <Field name="neighborhood" type="text" className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Barrio" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-5">
                                            <div>

                                            </div>
                                            <div className="col-span-2">
                                                <div className="mt-3 text-white">
                                                    <Field name="fullName" type="text" className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Nombre Completo" />
                                                </div>
                                            </div>
                                            <div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-center text-red-600 font-bold">
                                        <div className="flex flex-col">
                                            <div><ErrorMessage name="email" /></div>
                                            <div><ErrorMessage name="password" /></div>
                                            <div><ErrorMessage name="userName" /></div>
                                            <div><ErrorMessage name="phoneNumber" /></div>
                                            <div><ErrorMessage name="city" /></div>
                                            <div><ErrorMessage name="neighborhood" /></div>
                                            <div><ErrorMessage name="fullName" /></div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <button type="submit" className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-400 font-medium rounded-lg px-5 py-2 text-center w-full">Crear Cuenta</button>
                                    </div>
                                    <div className="flex justify-center mt-1 text-white gap-1">
                                        <div className="text-gray-400">Ya tienes una cuenta?</div>
                                        <a href="#" className="font-bold text-red-600" data-modal-hide="signUpModal" data-modal-target="signInModal" data-modal-toggle="signInModal">Inicia Sesión</a>
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

export default Signup