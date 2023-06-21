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

    if(password != confirmpassword){
        return res.status(422).json({msg: 'As senhas não conferem'})
    }

    // check se ja existe o usuario
    const userExists = await User.findOne({email: email})

    if(userExists){
        return res.status(422).json({msg: 'Por favor, utilize outro e-mail.'})
    }

    

    // create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // create user
    const user = new User({
        name, 
        email, 
        password: passwordHash,
    })

    try {
        await user.save()
        res.status(201).json({msg: "Usuário cadastrado com sucesso"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Aconteceu um erro no servidor"})
    }


})

app.post('/auth/login', async(req, res) => {

    const {email, password} = req.body

    if(!email){
        return res.status(422).json({msg: "O email é obrigatório!"})
    }

    if(!password){
        return res.status(422).json({msg: "A senha é obrigatória!"})
    }

    // check se o email existe
    const user = await User.findOne({email: email})

    if(!user){
        return res.status(404).json({msg: "Usuário não encontrado!"})
    }

    // check se a senha é igual
    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword){
        return res.status(422).json({msg: "Senha inválida!"})
    }   

    try {
        
        const secret = process.env.SECRET
        const token = jwt.sign({
            id: user._id,
        }, secret)

        res.status(200).json({msg: "Autenticação realizada com sucesso!",token})

    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Aconteceu um erro no servidor"})
    }

});

app.post('/user/:id', checkToken, async(req, res) =>{

    const id = req.params.id

    //check se o id existe
    const user = await User.findById(id, '-password')

    if(!user){
        res.status(404).json({msg:"Usuário não encontrado!"})
    }

    res.status(200).json({msg:user})

})

// Middleware para acessar a rota privada
function checkToken(req, res, next){

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] //Pois o authHeader é (Bearer TOKEN)

    if(!token){
        return res.status(401).json({msg:"Acesso negado"})
    }

    try {
    
        const secret = process.env.SECRET

        jwt.verify(token, secret)
        next()

    } catch (error) {
        res.status(400).json({msg: "Token Inválido"})
        
    }

}

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
