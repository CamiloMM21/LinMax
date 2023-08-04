import React from 'react';
import NavbarAndSidebar from "../../components/NavbarAndSidebar";
import { useNavigate } from "react-router-dom";

function Ayuda() {
    const navigate = useNavigate();

    const enviarSugerenciaView = () => {
        navigate("/ayuda/sugerencia");
    };

    const enviarPreguntaView = () => {
        navigate("/ayuda/pregunta");
    };

    return (
        <div>
            <NavbarAndSidebar />

            <div className="p-4 pt-10 bg-bggray h-screen sm:ml-64">
                <div className="p-4 px-10 pt-8 mt-14">
                    <div className="flex items-center justify-center h-10 mb-4 rounded">
                        <p className="text-4xl text-white dark:text-gray-500">Ayuda</p>
                    </div>
                    <div className="flex items-center justify-center ayudaheight p-5 py-10 mb-4 rounded-xl bg-gray-700">
                        <div className="grid grid-cols-1">
                            <div className="grid grid-rows-2 gap-16">
                                <div className="flex items-center justify-center">
                                    <button onClick={enviarSugerenciaView} type="submit" className="btn h-10 w-48">Enviar Sugerencia</button>
                                </div>
                                <div className="flex items-center justify-center">
                                    <button onClick={enviarPreguntaView} type="submit" className="btn h-10 w-48">Enviar Pregunta</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Ayuda