const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
 const secret = 'uhefuiwhfueihjgnsnjs'

 module.exports = app => {
    const {existsOrError,notExistOrError,equalOrError,validationEmail} = app.api.validation
    const signin = async (req,res)=> {
        const {name,email,password, admin} = req.body
        validationEmail(email,'email invalido')
        if (!email || !password) {
            return res.status(400).send('informe email e senha')
        }

        const user = await app.db('users').select('id','email','password','admin').where({email: email}).first()
        if(!user) return res.status(400).send('usuario nao encontrado')

        const isEqual = bcrypt.compare(password,user.password)
        if(!isEqual) return res.status(401).send('senha errada')

        const token = jwt.sign({name:user.name, email: user.email, admin: user.admin }, secret);
        return res.status(200).json({token : token})

    }
  return {signin}
 }