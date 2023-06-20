/*imports*/ 
require ('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

// Public Route
app.get('/',(req, res) => {
    res.status(200).json({msg:'Bem vindo!'});
});

// Config Json
app.use(express.json())

// Models 
const User = require('./models/User')

// Registrar usuario
app.post('/auth/register', async(req,res) => {

    const { name, email, password, confirmpassword } = req.body

    console.log(req.body)

    //validations
    if(!name){
        return res.status(422).json({msg: 'O nome é obrigatório'})
    }

    if(!email){
        return res.status(422).json({msg: 'O email é obrigatório'})
    }

    if(!password){
        return res.status(422).json({msg: 'A senha é obrigatório'})
    }

})

// Credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS


mongoose
.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.gzmuytc.mongodb.net/?retryWrites=true&w=majority`
    )
.then(() => {
    console.log('Conectou ao banco!')
    app.listen(3000)
})
.catch((err) => console.log(err))
