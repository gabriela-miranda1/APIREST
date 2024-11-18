const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//Model
const { usuario } = require("./../models/index");
const {
  generateAccesToken,
  generateRefreshToken,
} = require("../utils/jwtUtils");

const refreshTokens = [];

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        message: "Usuario no Encontrado",
        status: 401,
      });
    }

    // Verificar la contraseña (ejemplo con bcrypt)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Contraseña incorrecta",
        status: 401,
      });
    }

    // Generar accessToken y refreshToken
    const accessToken = generateAccesToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    // Almacenar el refreshToken
    refreshTokens.push(refreshToken); // Esto es solo un ejemplo, deberías usar una base de datos.

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    //Verifcar si existe el correo
    const existingUser = await usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya ha sido usado" });
    }

    //Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    //Crear un nuevo usuario
    const newUser = await usuario.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;
  //Verificar si se nos proporcione el refresgToken
  if (!refreshToken) {
    return res.status(401).json({
      massege: "Token de actualización no fue proporcionado",
      status: 401,
    });
  }

  //Verificar el resfresToken almacenado
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(401).json({
      message: "Refresh token inválido o expirado",
      status: 401,
    });
  }

  try {
    //verificar el refreshToken
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    //Generar un nuevo accesToken
    const accesToken = generateAccesToken({
      id: payload.id,
      email: payload.email,
    });

    return res.json({ accesToken });
  } catch (error) {
    return res.status(401).json({
      message: "Refresh Token no valido",
      status: 401,
    });
  }
};

const logout = (req, res) => {
  const { refreshToken } = req.body;

  //Eliminar el refreshToken del alamcenamiento
  const index = refreshTokens.indexOf(refreshToken);
  if (index > -1) {
    refreshTokens.splice(index, 1);
  }

  return res.json({ message: "Sesión Cerrada" });
};

module.exports = { login, register, refreshAccessToken, logout };
