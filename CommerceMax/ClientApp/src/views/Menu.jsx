import React, { useContext, useEffect, useState } from 'react';
import NavbarAndSidebar from "../components/NavbarAndSidebar";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../database/firebase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NotificationCounter from '../components/menssages/NotificationCounter';
import { ToastContainer } from "react-toastify";

function Menu() {
    const userInfo = useContext(AuthContext).currentUser;
    const navigate = useNavigate();
    const [product, setProduct] = useState([]);
    const [favorites, setFavorites] = useState({}); // Estado para almacenar favoritos

    useEffect(() => {
        const fetchData = async () => {
            const productList = [];
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                querySnapshot.forEach((doc) => {
                    productList.push({ id: doc.id, ...doc.data() });
                });
                setProduct(productList);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);

    const handleClick = (productId, productImg, productTitle, productDescription, productCategory, productPrice, productLocation) => {
        if (favorites[productId]) {
            // El producto ya es un favorito, eliminarlo
            deleteFavorite(productId);
        } else {
            // El producto no es un favorito, guardarlo
            addFavorite(productId, productImg, productTitle, productDescription, productCategory, productPrice, productLocation);
        }
    };

    const addFavorite = async (productId, productImg, productTitle, productDescription, productCategory, productPrice, productLocation) => {
        try {
            // REFERENCIA AL DOCUMENTO DE FAVORITES CON EL ID DEL USUARIO
            const favoritesDocRef = doc(db, "favorites", userInfo.uid);

            // REFERENCIA A LA COLECCION userFavorites DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
            const userFavoritesColRef = collection(
                favoritesDocRef,
                "userFavorites"
            );

            const existingRating = await setDoc(
                doc(userFavoritesColRef, productId),
                {
                    uid: userInfo.uid,
                    img: productImg,
                    title: productTitle,
                    description: productDescription,
                    category: productCategory,
                    price: productPrice,
                    location: productLocation
                }
            );

            // Actualizar el estado de favoritos
            setFavorites((prevFavorites) => ({
                ...prevFavorites,
                [productId]: true
            }));
        } catch (err) {
            console.log(err);
        }
    };

    const deleteFavorite = async (productId) => {
        try {
            // REFERENCIA AL DOCUMENTO DE FAVORITES CON EL ID DEL USUARIO
            const favoritesDocRef = doc(db, "favorites", userInfo.uid);

            // REFERENCIA A LA COLECCION userFavorites DENTRO DEL DOCUMENTO PREVIAMENTE REFERENCIADO
            const userFavoritesColRef = collection(
                favoritesDocRef,
                "userFavorites"
            );

            await deleteDoc(doc(userFavoritesColRef, productId));

            // Actualizar el estado de favoritos
            setFavorites((prevFavorites) => {
                const newFavorites = { ...prevFavorites };
                delete newFavorites[productId];
                return newFavorites;
            });
        } catch (err) {
            console.log(err);
        }
    };

    const menuChange = (e) => {
        e.preventDefault();
        navigate("/menu/menuVideos");
    }

    return (
        <div>
            <NavbarAndSidebar />
            <div className="h-full">
                <div className="p-4 pt-10 bg-bggray min-h-screen sm:ml-64">
                    <button onClick={menuChange} className="btnUpVideo h-10 w-26 font-medium text-md cursor-pointer mt-14">Menú Videos</button>
                    <div className="p-4 px-10 pt-8 mt-14">
                        <div className="flex items-center justify-center h-10 mb-4 rounded">
                            <p className="text-4xl text-white dark:text-gray-500">Menú Principal</p>
                        </div>
                        <div className="flex justify-center flex-wrap gap-5 h-full p-5 py-10 mb-4 rounded-xl bg-gray-700">
                            {product.map((product) => (
                                <div key={product.id} className="w-80 max-w-sm bg-bggray border border-gray-400 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                    <a href="#">
                                        <img className="object-cover h-52 w-96 p-8 rounded-t-lg" src={product.img} alt={product.title} />
                                    </a>
                                    <div className="px-5 pb-5">
                                        <a href="#">
                                            <h5 className="text-xl font-semibold tracking-tight text-white">{product.title}</h5>
                                        </a>
                                        <div className="text-gray-500 mt-2.5 mb-5">{product.description}</div>
                                        <div className="flex items-center mt-2.5 mb-5">
                                            <span className="flex items-center justify-between text-white text-sm font-bold">
                                                <p className="mr-1">{Math.round(product.rating * 10) / 10}</p>
                                                <svg aria-hidden="true" className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <title>First star</title>
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                </svg>
                                            </span>
                                            <span className="flex items-center justify-between text-white text-sm font-bold">
                                                <svg
                                                    className="w-5 h-5 text-red-600"
                                                    fill={favorites[product.id] ? 'currentColor' : 'none'}
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true"
                                                    onClick={() => handleClick(product.id, product.img, product.title, product.description, product.category, product.price, product.location)}
                                                >
                                                    <path
                                                        d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                                                    ></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-3xl font-bold text-white">$ {product.price}</span>
                                            <a onClick={() => navigate("/menu/info", { state: product.id })} className="btn font-medium text-sm cursor-pointer">Ver más</a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <NotificationCounter />
            </div>
            <ToastContainer className="toastWidth" />
        </div>
    );
}

export default Menu;