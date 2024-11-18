const notFoundResponse = (res, message = "Recurso no encontrado") => {
  return res.status(404).json({
    message,
    status: 404,
  });
};

const badRequestResponse = (res, message = "Solicitud incorrecta") => {
  return res.status(400).json({
    message,
    status: 400,
  });
};

const conflictResponse = (
  res,
  message = "Conflicto con los datos existentes",
) => {
  return res.status(409).json({
    message,
    status: 409,
  });
};

const forbiddenResponse = (res, message = "Acceso prohibido") => {
  return res.status(403).json({
    message,
    status: 403,
  });
};

const unauthorizedResponse = (res, message = "No autorizado") => {
  return res.status(401).json({
    message,
    status: 401,
  });
};

const internalServerErrorResponse = (
  res,
  message = "Error interno del servidor",
) => {
  return res.status(500).json({
    message,
    status: 500,
  });
};

module.exports = {
  notFoundResponse,
  badRequestResponse,
  conflictResponse,
  forbiddenResponse,
  unauthorizedResponse,
  internalServerErrorResponse,
};
