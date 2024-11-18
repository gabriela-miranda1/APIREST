const errorHandler = (err, req, res, next) => {
  console.log(err);

  const message = err.message || "error en el servidor";

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message,
    status,
  });
};
module.exports = errorHandler;
