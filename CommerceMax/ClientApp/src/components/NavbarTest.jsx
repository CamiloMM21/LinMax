function Navbar() {
  return (
    <nav className="navbar navbar-dark navbar-expand-lg bg-dark sticky-top">
        <div className="container">
            <a className="navbar-brand" href="#">
                <img src="./img/flor.png"  className="m-1 me-3" alt="Comemerce Max Logo" width="48" height="45" />
                Commerce Max
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Menú Principal</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Vender</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Historial</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Ayuda</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Favoritos</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Mi Perfil</a>
                        </li>
                        <a className="" href="#">
                            <img className="ms-4 rounded-circle border border-3" src="./img/user.png" alt="User Icon" width="65" height="65" />
                        </a>
                    </ul>
                    {/* <form className="d-flex" role="search">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-success" type="submit">Search</button>
                    </form> */}
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar