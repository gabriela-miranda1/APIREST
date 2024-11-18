const express = require("express");

const {
    getUsuariosList,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
} = require("./../controllers/usuariosController");

const authMiddleware = require("./../middlewares/authMiddlaware");

const router = express.Router();

router.get("/",authMiddleware,getUsuariosList);
router.get("/:id",authMiddleware,getUsuarioById);
router.post("/",authMiddleware,createUsuario);
router.put("/:id",authMiddleware,updateUsuario);
router.delete("/:id",authMiddleware,deleteUsuario);

module.exports= router;