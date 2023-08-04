import React, { useContext } from 'react';
import Home from './views/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Menu from './views/Menu';
import { AuthContext } from './context/AuthContext';
import Vender from './views/Vender';
import MisPublicaciones from './views/MisPublicaciones';
import Ayuda from './views/Ayuda/Ayuda';
import EnviarSugerencia from './views/Ayuda/EnviarSugerencia';
import EnviarPregunta from './views/Ayuda/EnviarPregunta';
import InformacionProducto from './views/InformacionProducto';
import AdministrarMiPublicacion from './views/AdministrarMiPublicacion';
import Buzon from './views/Buzon';
import ConfigPerfil from './views/ConfigPerfil';
import PerfilVendedor from './views/PerfilVendedor';
import MiPerfil from './views/MiPerfil';
import NoEncontrado from './views/notFound/NoEncontrado';
import SearchVista from './components/search/SearchVista';
import Categorias from './views/Categorias';
import Favoritos from './views/Favoritos';
import Historial from './views/Historial';
import MostrarCategorias from './views/MostrarCategorias';
import PublicarVideos from './views/PublicarVideos';
import InformacionVideo from './views/InformacionVideo';
import MisVideos from './views/MisVideos';
import AdiministrarVideo from './views/AdiministrarVideo';
import MenuVideos from "../src/views/MenuVideos"

function App() {
    // Creacion de funcion "RequireAuth" para controlar accesos a rutas por medio de "currentUser"
    const { currentUser } = useContext(AuthContext);
    const RequireAuth = ({ children }) => {
        return currentUser ? (children) : <Navigate to="/" />
    }

    return (
        <Router>
            <Routes>

                {/* RUTA DE HOME */}
                <Route
                    path='/'
                    element={<Home />}>
                </Route>

                {/* RUTA DE MENU */}
                <Route
                    path='/menu'
                    element={<RequireAuth><Menu /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA DE MOSTRARCATEGORIAS */}
                <Route
                    path='/categorias/mostrarcategorias'
                    element={<RequireAuth><MostrarCategorias /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA DE MIPERFIL */}
                <Route
                    path='/miperfil'
                    element={<RequireAuth><MiPerfil /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA DE FAVORITOS */}
                <Route
                    path='/favoritos'
                    element={<RequireAuth><Favoritos /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA DE HISTORIAL */}
                <Route
                    path='/historial'
                    element={<RequireAuth><Historial /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA DE INFORMACIONPRODUCTO */}
                <Route
                    path='/menu/info'
                    element={<RequireAuth><InformacionProducto /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA DE VENDER */}
                <Route
                    path='/vender'
                    element={<RequireAuth><Vender /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA DE MISPUBLICACIONES */}
                <Route
                    path='/publicaciones'
                    element={<RequireAuth><MisPublicaciones /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA DE MIPERFIL */}
                <Route
                    path='/miperfil'
                    element={<RequireAuth><MiPerfil /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA DE CATEGORIAS */}
                <Route
                    path='/categorias'
                    element={<RequireAuth><Categorias /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA DE ADMINISTRARMIPUBLICACION */}
                <Route
                    path='/publicaciones/administrar'
                    element={<RequireAuth><AdministrarMiPublicacion /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA DE AYUDA */}
                <Route
                    path='/ayuda'
                    element={<RequireAuth><Ayuda /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA DE ENVIARSUGERENCIA */}
                <Route
                    path='/ayuda/sugerencia'
                    element={<RequireAuth><EnviarSugerencia /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA DE ENVIARPREGUNTA */}
                <Route
                    path='/ayuda/pregunta'
                    element={<RequireAuth><EnviarPregunta /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA DE BUZON */}
                <Route
                    path='/buzon'
                    element={<RequireAuth><Buzon /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA DE CONFIGPERFIL */}
                <Route
                    path='/config'
                    element={<RequireAuth><ConfigPerfil /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA DE PERFILVENDEDOR */}
                <Route
                    path='/menu/info/perfilvendedor'
                    element={<RequireAuth><PerfilVendedor /></RequireAuth>}
                    exact>
                </Route>
                {/* RUTA DE RESULTADOS */}
                <Route
                    path='/resultados'
                    element={<RequireAuth><SearchVista /></RequireAuth>}
                    exact>
                </Route>

                {/* RUTA NotFound*/}
                <Route path="*"
                    element={<NoEncontrado />} >
                </Route>

                {/* RUTA PublicarVideos*/}
                <Route path="/publicarVideos"
                    element={<PublicarVideos />} >
                </Route>

                {/* RUTA InformacionVideo*/}
                <Route path="/informacionVideo"
                    element={<InformacionVideo />} >
                </Route>

                {/* RUTA MisVideos*/}
                <Route path="/misVideos"
                    element={<MisVideos />} >
                </Route>

                {/* RUTA administrarVideos*/}
                <Route path="/misVideos/administrarVideo"
                    element={<AdiministrarVideo />} >
                </Route>
                {/* RUTA menu Videos*/}
                <Route path="/menu/menuVideos"
                    element={<MenuVideos />} >
                </Route>


            </Routes>
        </Router>
        // <NavbarTest />
        // <LoginTest />
    )
}

export default App