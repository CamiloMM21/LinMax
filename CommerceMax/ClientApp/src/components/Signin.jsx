import { useContext, useState } from "react";
import { auth } from "../database/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ReactComponent as Mod } from "./assets/Mod.svg";
import {
  doc,
  serverTimestamp,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../database/firebase";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "flowbite";

function Signin() {
  const [userObj, setUserObj] = useState({
    email: "",
    userName: "",
    phoneNumber: "",
    city: "",
    neighborhood: "",
    fullName: "",
    photoURL: "",
  });

  const navigate = useNavigate();

  const menuView = () => {
    navigate("/menu");
  };

  const { dispatch } = useContext(AuthContext);

  const handleSignin = (values) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch({ type: "LOGIN", payload: user });
        toast.success("Has ingresado a tu cuenta!", {
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
            }, 4500);
          },
        });
      })
      .catch((error) => {
        toast.error("Correo o contraseña incorrectos!", {
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
      });
  };



  // VALIDACIONES DEL FORMULARIO
  const validar = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Correo obligatorio";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Correo inválido";
    } else if (!values.password) {
      errors.password = "Contraseña obligatoria";
    } else if (values.password.length < 8) {
      errors.password = "La contraseña debe ser mayor a 7 dígitos";
    }
    return errors;
  };

  return (
    // SIGN IN MODAL
    <div
      id="signInModal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed bg-black bg-opacity-25 backdrop-blur-sm top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full"
    >
      <div className="relative w-auto h-full max-w-lg md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="relative bg-bggray rounded-lg shadow">
          {/* <!-- Modal header --> */}
          <div className="flex items-start justify-between p-4 border-b rounded-t">
            <h3 className="text-xl font-semibold text-white">Sign In</h3>
            <button
              id="signInModalClose"
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            >
              <Mod />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* <!-- Modal body --> */}
          <div className="py-6 px-14">
            <div className="flex justify-center">
              <img
                src="./img/login-icon.svg"
                alt="login-icon"
                style={{ height: 7 + "rem" }}
              />
            </div>
            <div className="text-center text-4xl font-bold text-white">
              Login
            </div>
            <Formik
              initialValues={{
                email: "",
                password: "",
                userName: "",
                phoneNumber: "",
                city: "",
                neighborhood: "",
                fullName: "",
              }}
              onSubmit={handleSignin}
              validate={validar}
            >
              <Form>
                <div className="mt-6 text-white">
                  <label
                    htmlFor="email"
                    className="block mb-1 text-sm font-medium text-white"
                  >
                    Correo
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="bg-gray-600 border border-gray-500 placeholder-gray-400 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="example@email.com"
                    autoComplete="username"
                  />
                </div>
                <div className="mt-2 text-white">
                  <label
                    htmlFor="password"
                    className="block mb-1 text-sm font-medium text-white"
                  >
                    Contraseña
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className="bg-gray-600 border border-gray-500 placeholder-gray-400 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
                <div className="mt-4 flex justify-center text-red-600 font-bold">
                  <div className="flex flex-col">
                    <div>
                      <ErrorMessage name="email" />
                    </div>
                    <div>
                      <ErrorMessage name="password" />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-400 font-medium rounded-lg px-5 py-2 text-center w-full"
                  >
                    Login
                  </button>
                </div>
                <div className="flex justify-center mt-1 text-white gap-1">
                  <div className="text-gray-400">No tienes una cuenta?</div>
                  <button
                    className="font-bold text-red-600"
                    data-modal-hide="signInModal"
                    data-modal-target="signUpModal"
                    data-modal-toggle="signUpModal"
                  >
                    Regístrate
                  </button>
                </div>
              </Form>
            </Formik>
         
          </div>
        </div>
      </div>
      <ToastContainer className="toastWidth" />
    </div>
  );
}

export default Signin;