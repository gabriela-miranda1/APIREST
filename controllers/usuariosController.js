/** @type {import("express").RequestHandler}*/

const bcrypt = require("bcrypt");
const {usuario} = require("./../models/index");
const{ request, response}= require("express");
const {
    notFoundResponse,
    conflictResponse
} = require("../utils/responseUtils");

const {ValidationError} = require("sequelize");

const getUsuariosList= async (req=request, res= response)=>{
    const users = await usuario.findAll({ order: ["id"]});
    return res.status(200).json(users);
};

const getUsuarioById = async(req= request, res= response)=>{
    const id = req.params.id;
    const user = await usuario.finByPk(id,{
        attibutes: { exclude: ["password"]},//Exluye la contraseña
    });

    if(user === null){
        return notFoundResponse(res,"Usuario no encontrado");
    }
    return res.status(200).json(user);
};
const createUsuario = async (req=request, res=response)=>{
    const {username, email, password: plainPassword}= req.body;

    //Encriptar contraseña
    const password = await bcrypt.hash(plainPassword,10);

    let user;

    try {
        user = await usuario.crete({
            username,
            email,
            password
        });
    } catch (error) {
        if(error instanceof ValidationError){
            return conflictResponse(res, "No se pudo crear el usuario")
        }
    }

    user.password= undefined;
    return res.status(201).json(user);
}

const updateUsuario= async(req=request, res=response)=>{
    const { username, email, password, is_active}= req.body;
    const id = req.params.id;

    const user = await usuario.finByPk(id);
    if(user === null){
        return notFoundResponse(res, "usuario no encontrado");
    }

    //Validaciones
    if(username !== undefined){
        user.username = username
    }

    const existingUser = await usuario.findOne({where: {email}});

    if(existingUser){
        //hay un usuario que tiene ese correo actualmente
        if(existingUser.id !== user.id){
            return res.status(400).json({message: "El correo ya esta en uso"});
        }
    }else{
        user.email=email;
    }

    if(password !== undefined){
        user.password = await bcrypt.hash(password,10);
    }

    if(is_active !== undefined){
        user.is_active=is_active;
    }

    await user.save();
    return res.status(200).json(user);

};

const deleteUsuario = async(req=request, res=response)=>{
    const id= req.params.id;
    const user = await usuario.finByPk(id);
    if(user === null){
        return notFoundResponse(res, "Usuarion no encontrado");
    }
    user.destroy();
    return res.status(204).json();
};

module.exports={
    getUsuarioById,
    getUsuariosList,
    createUsuario,
    updateUsuario,
    deleteUsuario,
};

