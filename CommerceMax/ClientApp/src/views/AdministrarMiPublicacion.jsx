import React, { useEffect, useState } from 'react';
import NavbarAndSidebar from "../components/NavbarAndSidebar";
import { useLocation } from 'react-router-dom';
import { doc, getDoc, getDocs , collection, setDoc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../database/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Img } from "../components/assets/Img.svg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdministrarMiPublicacion() {

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
    const navigate = useNavigate();
    const location = useLocation();

    // ID DEL POST PREVIAMENTE ENVIADO POR MISPUBLICACIONES
    const PostId = location.state;

    const [product, setProduct] = useState({
        id: "",
        title: "",
        description: "",
        category: "",
        price: "",
        location: ""
    });

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
                        setProduct((prev) => ({ ...prev, img: downloadURL }))
                    });
                }
            );
        }
        file && uploadFile();
    }, [file])

    // USEEFFECT PARA OBTENER LA PUBLICACION DE FIREBASE
    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, 'products', PostId);

            const docSnap = await getDoc(docRef);
            const product = docSnap.data();
            setProduct({
                ...product,
                id: docSnap.id
            });
        }
        fetchData();
    }, []);

    const handleChangeText = (name, value) => {
        setProduct({ ...product, [name]: value })
    }

    const cancel = (e) => {
        e.preventDefault();
        navigate("/publicaciones");
    }

    const updateProduct = async (e) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, 'products', PostId), {
                ...product
            });
            toast.success('Actualización exitosa!', {
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
                        navigate("/publicaciones");
                    }, 4500)
                }
            });
        } catch (err) {
            console.log(err)
        }
    }

    const deleteProduct = async (e) => {
        e.preventDefault();
        try {
            await deleteDoc(doc(db, 'products', PostId))
            toast.error('Eliminación exitosa!', {
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
                        navigate("/publicaciones");
                    }, 4500)
                }

            });
        } catch (err) {
            console.log(err)
        }
    }
    // console.log(product);

    return (
        <div>
            <NavbarAndSidebar />

            <div className="p-4 pt-10 bg-bggray h-screen sm:ml-64">
                <div className="p-4 px-10 pt-8 mt-14">
                    <div className="flex items-center justify-center h-10 mb-4 rounded">
                        <p className="text-4xl text-white dark:text-gray-500">Administrar Mi Publicacion</p>
                    </div>
                    <div className="flex items-center justify-center h-full p-5 py-10 mb-4 rounded-xl bg-gray-700">
                        <div className="grid auto-rows-auto gap-10">
                            <form onSubmit={updateProduct}>
                                <div className="grid grid-cols-2 gap-5 mb-4">
                                    <div className="grid auto-rows-auto gap-3">
                                        <input value={product.title} type="text" className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Titulo" required onChange={(e) => handleChangeText('title', e.target.value)} />

                                        <div className="flex items-center justify-center">
                                            <img src={file ? URL.createObjectURL(file) : product.img} className="w-32 h-32 rounded-full" alt="" />
                                        </div>

                                        <label htmlFor="file" className="flex text-gray-300 text-sm block w-full p-2.5">
                                            <p>Imagen: </p>
                                            <Img />
                                        </label>

                                        <input type="file" id="file" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
                                    </div>
                                    <div className="grid auto-rows-auto gap-5">
                                        <textarea value={product.description} className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Descripcion" required onChange={(e) => handleChangeText('description', e.target.value)}></textarea>
                                        <select value={product.category} className="bg-gray-600 border border-gray-500 text-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required onChange={(e) => handleChangeText('category', e.target.value)}>
                                            <option value="">Categorías</option>
                                            {
                                                category.map(category => {
                                                    return (
                                                        <option key={category.id} value={category.name}>{category.name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input value={product.price} type="number" className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Precio" required onChange={(e) => handleChangeText('price', e.target.value)} />
                                            <input value={product.location} type="text" className="bg-gray-600 border border-gray-500 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Ubicación" required onChange={(e) => handleChangeText('location', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-24">
                                    <button disabled={perc !== null && perc < 100} type="submit" className="btnUpdate h-10 w-28 font-medium text-md cursor-pointer">Actualizar</button>
                                    <button disabled={perc !== null && perc < 100} onClick={deleteProduct} className="btnDelete h-10 w-26 font-medium text-md cursor-pointer">Eliminar</button>
                                </div>
                                <div className="flex items-center justify-center mt-16">
                                    <button disabled={perc !== null && perc < 100} onClick={cancel} className="btn h-10 w-26 font-medium text-md cursor-pointer">Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer className="toastWidth" />
        </div>
    )
}

export default AdministrarMiPublicacion