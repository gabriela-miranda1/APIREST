const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split("")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso denegado, token no fue proporcionado" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token no es válido" });
  }
};

module.exports = authMiddleware;
