import React, { useEffect, useState } from 'react';
import NavbarAndSidebar from "../components/NavbarAndSidebar";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../database/firebase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationCounter from '../components/menssages/NotificationCounter';
import { ToastContainer } from "react-toastify";

function Buzon() {
    const [product, setProduct] = useState([]);
    const userInfo = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            const productList = [];
            const q = query(collection(db, "responses"), where("uid", "==", userInfo.currentUser.uid));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                productList.push({ id: doc.id, ...doc.data() });
            });
            setProduct(productList);
        }
        fetchData();
    }, []);


    return (
        <div>
            <NavbarAndSidebar />
            <div className="h-full">
                <div className="p-4 pt-10 bg-bggray min-h-screen sm:ml-64">
                    <div className="p-4 px-10 pt-8 mt-14">
                        <div className="flex items-center justify-center h-10 mb-4 rounded">
                            <p className="text-4xl text-white dark:text-gray-500">Buzón</p>
                        </div>
                        <div className="flex justify-center flex-wrap gap-5 h-full p-5 py-10 mb-4 rounded-xl bg-gray-700">
                            {
                                product.map(product => {
                                    return (
                                        <div key={product.id} className="w-80 max-w-sm bg-bggray border border-gray-400 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                            <a>
                                                <img className="object-cover h-52 w-96 p-8 rounded-t-lg" src={product.img} alt={product.title} />
                                            </a>
                                            <div className="px-5 pb-5">
                                                <a>
                                                    <h5 className="text-xl font-semibold tracking-tight text-white">{product.title}</h5>
                                                </a>
                                                <div className="text-gray-500 mt-2.5 mb-5">{product.description}</div>
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

export default Buzon