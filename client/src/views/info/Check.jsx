import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../../database/firebase";
import { useNavigate } from "react-router-dom";

function Check({ postId }) {
  const navigate = useNavigate();
  const [mostrarProducto, setMostrarProducto] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Consulta para obtener el nombre de la categoría correspondiente al postId
        const docRef = doc(db, "products", postId);
        const docSnap = await getDoc(docRef);
        const name = docSnap.data().category;

        // Consulta para obtener los productos de la categoría correspondiente
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("category", "==", name));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
  
        setMostrarProducto(products);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [postId]);

  const refress = (e)=>{
    e.preventDefault();
    setMostrarProducto()
  }

  const informacionProductoView = (id) => {
    navigate("/menu/info", { state: id });
    window.location.reload();
  }

  return (
    <>
    {refress.length === 0 ? (
  <p className="text-red-500">No hay referencias</p>
) : (
  <div className="flex flex-wrap justify-around">
    {mostrarProducto.filter((product) => product.id !== postId).slice(0, 3).map((product) => (
      <div key={product.id} className="bg-bggray w-[200px] p-2 rounded-md mx-2 my-2 cursor-pointer">
        <img className="w-[100%] h-24 object-cover rounded-md" src={product.img} alt={product.title} />
        <a onClick={() => informacionProductoView(product.id) } className="text-blue-600 mt-2 font-bold hover:underline hover:text-underline-thickness-2">
          Mas información
        </a>
      </div>
    ))}
  </div>
)}
    </>
  );
  
}




export default Check;
