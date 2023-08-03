import React, { useEffect, useState } from 'react';
import NavbarAndSidebar from "../components/NavbarAndSidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../database/firebase";
import { useNavigate } from "react-router-dom";
import NotificationCounter from '../components/menssages/NotificationCounter';
import { FaArrowLeft } from 'react-icons/fa';
import { ToastContainer } from "react-toastify";

function MenuVideos() {
    const navigate = useNavigate();

    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const videoList = [];
            try {
                const querySnapshot = await getDocs(collection(db, "videos"));
                querySnapshot.forEach((doc) => {
                    videoList.push({ id: doc.id, ...doc.data() });
                });
                setVideos(videoList);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    const menuChange = (e) => {
        e.preventDefault();
        navigate("/menu");

    }

    return (
        <div>
            <NavbarAndSidebar />
            <div className="h-full">
                <div className="p-4 pt-10 bg-bggray min-h-screen sm:ml-64">
                    <div className="flex  h-10 rounded mt-12  ">
                        <FaArrowLeft
                            className="text-md cursor-pointer  h-8 w-8 text-red-700"
                            onClick={menuChange}
                        />
                    </div>
                    <div className="p-4 px-10 pt-8 mt-14">

                        <div className="flex items-center justify-center h-10 mb-4 rounded">
                            <p className="text-4xl text-white dark:text-gray-500">Menú Videos</p>
                        </div>
                        <div className="flex justify-center flex-wrap gap-5 h-full p-5 py-10 mb-4 rounded-xl bg-gray-700">
                            {videos.map((video) => {
                                return (
                                    <div key={video.id} className="w-80 max-w-sm bg-bggray border border-gray-400 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                        <a>
                                            <video className="object-cover h-52 w-96 p-8 rounded-t-lg" src={video.url} alt={video.title} autoPlay muted loop></video>
                                        </a>
                                        <div className="px-5 pb-5">
                                            <a href="#">
                                                <h5 className="text-xl font-semibold tracking-tight text-white">{video.title}</h5>
                                            </a>
                                            <div className="text-gray-500 mt-2.5 mb-5">{video.description}</div>
                                            <div className="flex items-center justify-between">

                                                <a onClick={() => navigate("/informacionVideo", { state: video.id })} className="btn font-medium text-sm cursor-pointer">Ver más</a>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                </div>
                <NotificationCounter />
                <ToastContainer className="toastWidth" />
            </div>
        </div>
    )
}

export default MenuVideos