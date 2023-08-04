import React, { useEffect, useState } from 'react';
import NavbarAndSidebar from "../components/NavbarAndSidebar";
import { collection, getDocs, useParams, } from "firebase/firestore";
import { db } from "../database/firebase";
import { useNavigate } from "react-router-dom";
import NotificationCounter from '../components/menssages/NotificationCounter';
import { ToastContainer } from "react-toastify";

function Categorias() {

    const navigate = useNavigate();
    //USESTATE PARA CATEGORÍAS
    const [category, setCategory] = useState([]);

    //CONSULTA A FIREBASE PARA OPTENER UNA OPCION POR CATEGORIA EXISTENTE EN CATEGORIES
    useEffect(() => {
        const fetchData = async () => {
            const categoryList = [];
            try {
                const querySnapshot = await getDocs(collection(db, "categories"));

                querySnapshot.forEach((doc) => {
                    categoryList.push({ id: doc.id, ...doc.data() });
                });
                setCategory(categoryList);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [])

    return (
        <div>
            <NavbarAndSidebar />
            <div className="flex items-center justify-center h-full">
                <div className="p-4 pt-10 bg-bggray min-h-screen sm:ml-64">
                    <div className="p-4 px-10 pt-8 mt-14">
                        <div className="flex items-center justify-center h-10 mb-4 rounded">
                            <p className="text-4xl text-white dark:text-gray-500">Categorias</p>
                        </div>
                        <div className="flex justify-center flex-wrap gap-5 h-full p-5 py-10 mb-4 rounded-xl bg-gray-700">
                            {
                                category.map(category => {
                                    return (
                                        <div key={category.id} className="w-80 max-w-sm bg-bggray border border-gray-400 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                            <div className="px-5 pb-5">
                                                <a>
                                                    <h5 className="text-xl font-semibold tracking-tight text-white mt-3">{category.name}</h5>
                                                </a>

                                                <a href="#">
                                                    <img className="object-cover h-52 w-96 p-8 rounded-t-lg" src={category.img} alt={category.name} />
                                                </a>
                                                <div className="text-gray-500 mt-2.5 mb-5">{category.description}</div>
                                                <div className="flex items-center justify-between">
                                                    {/* NAVIGATE A ADMINISTRAR Y LE PASAMOS EL ID DE LA PUBLICACION PARA POSTERIOR CONSULTA EN FIREBASE */}
                                                    <a onClick={() => { navigate(`/categorias/mostrarcategorias?name=${category.name}`) }} className="btn font-medium text-sm cursor-pointer">Administrar</a>

                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <NotificationCounter />
            <ToastContainer className="toastWidth" />
        </div>

    )
}

export default Categorias;