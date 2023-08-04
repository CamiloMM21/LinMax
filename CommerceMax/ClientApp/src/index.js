import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
/*IMPORTACION DE BOOTSTRAP*/
// import * as bootstrap from 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

/*IMPORTACION DE TAILWINDCSS*/
import './index.css';
import { Modal } from 'flowbite';


import { AuthContextProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   
    <AuthContextProvider>
      <App />
    </AuthContextProvider>

  </React.StrictMode>
);
