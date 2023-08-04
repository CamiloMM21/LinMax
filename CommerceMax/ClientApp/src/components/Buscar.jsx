import React,{useState} from "react";
import { ReactComponent as Search2 } from "./assets/Search2.svg";
import { ReactComponent as Search } from "./assets/Search.svg";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../database/firebase";

function Buscar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();

    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);
    const product = [];
    
    querySnapshot.forEach((doc) => {
      // convertir todas las letras de una cadena de texto a minúsculas. 
      const title = doc.data().title.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();
    // el método startsWith de JavaScript para verificar si el título del producto comienza con la cadena de búsqueda 
      if (title.startsWith(searchTermLower)) {
        product.push({ id: doc.id, ...doc.data() });
      }
    });
    
    
    

    navigate("/resultados", { state: { product } });
  };
  return (
    <div className="flex justify-center ">
    <form className="flex items-center absolute mr-40 " onSubmit={handleSubmit}>
      <label htmlFor="simple-search" className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
       <Search/>
        </div>
        <input
          type="text"
          id="simple-search"
          className="bg-gray-700 border border-gray-700 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-72 pl-10  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 caret-blue-500"
          placeholder="Search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="p-2 ml-2 text-sm font-medium text-white bg-red-700 rounded-lg border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
      >
    <Search2/>
        <span className="sr-only">Search</span>
      </button>
    </form>
  </div>
  )
}

export default Buscar