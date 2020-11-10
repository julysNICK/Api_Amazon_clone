const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

module.exports = app =>{
    const {existsOrError,notExistOrError,equalOrError,validationEmail} = app.api.validation
    const secret = 'uhefuiwhfueihjgnsnjs'
    const encryptPassword = password =>{
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }
    const save = async(req,res) => {
        const user = {...req.body}
        if(req.params.id) user.Id = req.params.id
        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || req.user.admin) user.admin = false

        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email,'E-mail não informado')
            validationEmail(user.email, 'email invalido')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de senha inválida')
            equalOrError(user.password, user.confirmPassword, 'Senhas não conferem')
            const userFromDb = await app.db('users').where({email: user.email}).first()
            if(!user.id === undefined){
                notExistOrError(userFromDb, 'usuario já cadastrado')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }
        user.password = encryptPassword(req.body.password)
        delete user.confirmPassword

        if(user.id){
            app.db('users')
                .update(user)
                .where({id: user.id})
                .whereNull('deleteAt')
                .then(_=> res.status(204))
                .catch(err => res.status(500).send(err))
        }else{
            app.db('users')
                .insert(user)
                .then(_=>res.status(204).send())
                .catch(err => res.status(500).send(err))
        }


    }
   const getUsers = (req , res) => {
       app.db('users')
            .select('id','name','email','admin')
            .then(users => res.json({users}) )
            .catch(err => res.status(500).send(err))
   }
  return{save,getUsers}
}