//ESTOO ES PARA HACER PRUEBAS CON SIGNALR EN EL CHAT  CLIENT

import React, { Component } from 'react';
// se importo la libreria signalr  para la conexion de chat
import * as signalR from '@microsoft/signalr';

class PruebeChat extends Component {
    // valores nombre para para el cambio de valores

  state = {
    connection: null,
    user: '',
    message: '',
    chatMessages: []
  };

  componentDidMount() {
    // Crear una conexión al hub de SignalR en el servidor
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/chatHub') // Cambia la URL según tu configuración
      .withAutomaticReconnect() // Configurar la reconexión automática en caso de desconexión
      .configureLogging(signalR.LogLevel.Information) // Configurar el nivel de registro
      .build();

    // Iniciar la conexión
    connection
      .start()
      .then(() => {
        console.log('Connected to SignalR');
      })
      .catch((err) => {
        console.error('Error connecting to SignalR:', err);
      });

    // Manejar los mensajes recibidos desde el servidor
    connection.on('ReceiveMessage', (user, message) => {
      const chatMessage = `${user}: ${message}`;
      this.setState((prevState) => ({
        chatMessages: [...prevState.chatMessages, chatMessage]
      }));
    });

    // Establecer la conexión en el estado del componente
    this.setState({ connection });
  }

  // Manejar cambios en los campos de entrada
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // Manejar el envío de mensajes al servidor
  handleSubmit = (event) => {
    event.preventDefault();
    const { connection, user, message } = this.state;
    if (connection) {
      connection
        .invoke('SendMessage', user, message) // Llamar al método "SendMessage" en el servidor
        .catch((err) => {
          console.error('Error sending message:', err);
        })
        .finally(() => {
          // Limpiar el campo de mensaje después de enviar
          this.setState({ message: '' });
        });
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>SignalR Chat Example</h1>
          <div>
            {this.state.chatMessages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
          <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              name="user"
              placeholder="User"
              value={this.state.user}
              onChange={this.handleInputChange}
            />
            <input
              type="text"
              name="message"
              placeholder="Message"
              value={this.state.message}
              onChange={this.handleInputChange}
            />
            <button type="submit">Send</button>
          </form>
        </header>
      </div>
    );
  }
}



export default PruebeChat;