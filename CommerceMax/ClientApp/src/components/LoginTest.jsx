function Login() {
  return (
    <div className="bg-dark d-flex justify-content-center align-items-center vh-100">
        <div className="bg-black p-5 rounded-5 text-secondary shadow" style={{width: 25 + 'rem'}}>
            <div className="d-flex justify-content-center">
                <img src="./img/login-icon.svg" alt="login-icon" style={{height: 7 + 'rem'}}/>
            </div>
            <div className="text-center fs-1 fw-bold text-white">Login</div>
            <div className="input-group mt-4">
                <div className="input-group-text bg-danger">
                    <img src="./img/username-icon.svg" alt="username-icon" style={{height: 1 + 'rem'}}/>
                </div>
                <input className="form-control bg-light outline-none" type="text" placeholder="Usuario" style={{outline: 'none'}}/>
            </div>
            <div className="input-group mt-1">
                <div className="input-group-text bg-danger">
                    <img src="./img/password-icon.svg" alt="password-icon" style={{height: 1 + 'rem'}}/>
                </div>
                <input className="form-control bg-white" type="password" placeholder="Contraseña" />
            </div>
            <div className="d-flex justify-content-around mt-1">
                <div className="d-flex align-items-center gap-1">
                    <input className="form-check-input" type="checkbox" />
                    <div className="pt-1" style={{fontSize: 0.9 + 'rem'}}>Recuérdame</div>
                </div>
                <div className="pt-1">
                    <a href="#" className="text-decoration-none text-danger fw-semibold fst-italic" style={{fontSize: 0.9 + 'rem'}}>Olvidaste tu contraseña?</a>
                </div>
            </div>
            <div className="btn text-white w-100 mt-4 fw-semibold shadow-sm bg-danger">
                Login
            </div>
            <div className="d-flex gap-1 justify-content-center mt-1">
                <div>No tienes una cuenta?</div>
                <a href="#" className="text-decoration-none text-danger fw-semibold">Regístrate</a>
            </div>
            <div className="p-3">
                <div className="border-bottom text-center" style={{height: 0.9 + 'rem'}}>
                    <span className="bg-black px-3">or</span>
                </div>
            </div>
            <div className="btn d-flex gap-2 justify-content-center border mt-3 shadow-sm">
                <img src="./img/google-icon.svg" alt="google-icon" style={{height: 1.6 + 'rem'}}/>
                <div className="fw-semibold text-white">Continuar con Google</div>
            </div>
        </div>
    </div>
  )
}

export default Login