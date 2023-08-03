import React, { useEffect, useState } from "react";
import NavbarAndSidebar from "../components/NavbarAndSidebar";
import NotificationCounter from "../components/menssages/NotificationCounter";
import { db } from "../database/firebase";
import { useLocation } from "react-router-dom";
//import { collection, getDocs , useParams, } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function MostrarCategorias() {
  const navigate = useNavigate();

  const valores = window.location.search;
  let urlParams = new URLSearchParams(valores);
  var name = urlParams.get("name");

  const [mostrarProducto, setMostrarProducto] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      const products = [];
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("category", "==", name));

        const querySnapshot = await getDocs(q);

        // guardar resultados de la consulta en el array products[]
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() });
        });
        setMostrarProducto(products);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategory();
  }, []);

  return (
    <div>
      <NavbarAndSidebar />
      <div className="flex items-center justify-center h-full">
        <div className="p-4 pt-10 bg-bggray min-h-screen sm:ml-64">
          <div className="p-4 px-10 pt-8 mt-14">
            <div className="flex items-center justify-center h-10 mb-4 rounded">
              <p className="text-4xl text-white dark:text-gray-500">
                Mostrar Categorias{" "}
              </p>
            </div>
            <div className="flex justify-center flex-wrap gap-5 h-full p-5 py-10 mb-4 rounded-xl bg-gray-700">
              {mostrarProducto.map((mostrarProducto) => {
                return (
                  <div
                    key={mostrarProducto.id}
                    className="w-80 max-w-sm bg-bggray border border-gray-400 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                  >
                    <a href="#">
                      <img
                        className="object-cover h-52 w-96 p-8 rounded-t-lg"
                        src={mostrarProducto.img}
                        alt={mostrarProducto.title}
                      />
                    </a>
                    <div className="px-5 pb-5">
                      <a href="#">
                        <h5 className="text-xl font-semibold tracking-tight text-white">
                          {mostrarProducto.title}
                        </h5>
                      </a>
                      <div className="text-gray-500 mt-2.5 mb-5">
                        {mostrarProducto.description}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-white">
                          $ {mostrarProducto.price}
                        </span>
                        <a
                          onClick={() =>
                            navigate("/menu/info", {
                              state: mostrarProducto.id,
                            })
                          }
                          className="btn font-medium text-sm cursor-pointer"
                        >
                          Ver más
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <NotificationCounter />
      <ToastContainer className="toastWidth" />
    </div>
  );
}

export default MostrarCategorias;
