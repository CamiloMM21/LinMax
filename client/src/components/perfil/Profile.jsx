import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  doc,
  getDoc,
  where,
  getDocs,
  collection,
  query,
} from "firebase/firestore";
import { db } from "../../database/firebase";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  //  ID DEL POST PREVIAMENTE ENVIADO POR MISPUBLICACIONES
  const PostId = location.state;
  const [photoURL, setphotoURL] = useState("");
  const [user, setUser] = useState({
    id: "",
    email: "",
    userName: "",
    phoneNumber: "",
    city: "",
    neighborhood: "",
    fullName: "",
    photoURL: "",
  });
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "products", PostId);
      const docSnap = await getDoc(docRef);
      const datos = docSnap.data();
      const uid = datos ? datos.uid : null;

      if (uid) {
        const userdocRef = doc(db, "users", uid);
        const userdocSnap = await getDoc(userdocRef);
        const userDatos = userdocSnap.data();
        setphotoURL(userDatos.photoURL.downloadURL);
        const filteredUserDatos = Object.keys(user).reduce((acc, key) => {
          if (userDatos[key]) {
            acc[key] = userDatos[key];
          }
          return acc;
        }, {});
        setUser(filteredUserDatos);

        const productList = [];
        const q = query(collection(db, "products"), where("uid", "==", uid));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          productList.push({ id: doc.id, ...doc.data() });
        });
        setProduct(productList);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto bg-bggray rounded-sm shadow-md overflow-hidden w-[100%] h-[90vh] ">
      <div className="md:flex">
        <div className="md:flex-shrink-0 md:w-48 pt-2 pl-2  ">
          <img
            className="h-48 w-full object-cover border-spacing-y-72 border-8 border-gray-500   border-gray-600 cursor-pointer hover:scale-110 transform transition-all duration-200 ease-in-out   "
            src={photoURL || user.photoURL}
            alt="Profile image"
          />
        </div>
        <div className="p-4 ">
          <h1 className="text-3xl font-bold mb-2 text-white">
            {user.fullName || user.userName}
          </h1>
          <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">
            {user.email}
          </div>
          <div className="ml-[400px] max-sm:ml-auto max-md:ml-auto text-gray-200   ">
            <h2 className="text-xl font-bold mb-4 ">
              Ciudad: {user.city || "Sin informacion"}
            </h2>

            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">
                Barrio: {user.neighborhood || "Sin informacion"}
              </h2>
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">
                Telefono: {user.phoneNumber || "Sin informacion"}
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold mb-2 text-red-600">
          Productos publicados por
        </h2>
        <p className="text-gray-100 mb-4">@{user.userName}</p>
        <div className=" flex items-center justify-center h-full p-5 py-10 mb-4 rounded-xl mx-10 bg-gray-700">
          {product.map((product) => {
            return (
              <div
                key={product.id}
                className="grid grid-flow-row bg-bggray w-[200px] p-2 rounded-md mx-2 my-2   cursor-pointer hover:scale-110 transform transition-all duration-300 ease-in-out"
              >
                <img
                  className="w-[100%] h-24  object-cover rounded-md"
                  src={product.img}
                  alt={product.title}
                />
                <p className="text-gray-100 mt-2 font-bold ">{product.title}</p>
                <a
                  onClick={() => navigate("/menu/info", { state: product.id })}
                  className="text-blue-600 font-bold hover:underline hover:text-underline-thickness-2"
                >
                  Informacion
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
