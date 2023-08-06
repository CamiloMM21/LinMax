//ESTOO ES PARA HACER PRUEBAS CON SIGNALR EN EL CHAT  CLIENT

import React, { useState, useEffect } from 'react';
// se importo la libreria signalr  para la conexion de chat
import * as signalR from '@microsoft/signalr';

function PruebeChat() {
 const [connection, setConnection] = useState(null);
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    // Crear una conexión al hub de SignalR en el servidor
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/chatHub') // Cambia la URL según tu configuración
      .withAutomaticReconnect() // Configurar la reconexión automática en caso de desconexión
      .configureLogging(signalR.LogLevel.Information) // Configurar el nivel de registro
      .build();

    // Iniciar la conexión
    newConnection
      .start()
      .then(() => {
        console.log('Connected to SignalR');
      })
      .catch((err) => {
        console.error('Error connecting to SignalR:', err);
      });

    // Manejar los mensajes recibidos desde el servidor
    newConnection.on('ReceiveMessage', (user, message) => {
      const chatMessage = `${user}: ${message}`;
      setChatMessages((prevMessages) => [...prevMessages, chatMessage]);
    });

    // Establecer la conexión en el estado
    setConnection(newConnection);

    // Limpieza al desmontar el componente
    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'user') {
      setUser(value);
    } else if (name === 'message') {
      setMessage(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (connection) {
      connection
        .invoke('SendMessage', user, message) // Llamar al método "SendMessage" en el servidor
        .catch((err) => {
          console.error('Error sending message:', err);
        })
        .finally(() => {
          setMessage('');
        });
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>SignalR Chat Example</h1>
        <div>
          {chatMessages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="user"
            placeholder="User"
            value={user}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="message"
            placeholder="Message"
            value={message}
            onChange={handleInputChange}
          />
          <button type="submit">Send</button>
        </form>
      </header>
    </div>
  );
}




export default PruebeChat;