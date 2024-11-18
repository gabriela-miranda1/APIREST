const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

//Importando rutas
const authRoutes = require("./routes/authRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");

const http = require("http");
const notFoundHandler = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Registar rutas
app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);


//Middleware es para manejar rutas inexistentes
app.use(notFoundHandler);
//Middleware es para manejar errores
app.use(errorHandler);

const port = parseInt(process.env.PORT, 10) || 8000;
app.set("port", port);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

module.exports = app;
