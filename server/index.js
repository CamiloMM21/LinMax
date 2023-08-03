import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";
import morgan from "morgan";
import cors from "cors";
import { PORT } from "./config.js";

const app = express();

//SE CREA UN SERVIDOR HTPP
const server = http.createServer(app);
// LUEGO SE CREA UNA NUEVA INSTANCIA DEL soketsServer
const io = new SocketServer(server, {
  //CREACION DE OBJETO DENTRO DE LA RUTA HTPP, PERMITE QUE EL FRONTED SE COMUNIQUE CON EL BAKEND
  cors: {
    origin: "http://localhost:3000",
  },
});

// ES PARA QUE CUALQUIER SERVIDOR EXTERNO SE PUEDA COMUNICAR
app.use(cors());
app.use(morgan("dev"));


io.on("connection", (socket) => {
  socket.on("message", ({ message, uid, nombre, photo }) => {
    console.log("message:", message);
    io.to(uid).emit("message", { message, uid, nombre, photo })
    io.emit("message2",  message);
    io.emit("nuevo mensaje", { message, nombre, uid, photo });;
  });

  socket.on("message2", ({ message, uid }) => {
    console.log("message2:", message);
    io.to(uid).emit("message2", { message, uid }); 
    io.emit("message",  message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});


server.listen(PORT, () => {
  console.log("listening on *:3000", PORT);
});
