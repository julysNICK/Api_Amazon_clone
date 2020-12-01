const bcrypt = require('bcrypt')
const jwt = require('jwt-simple');
 const secret = 'uhefuiwhfueihjgnsnjs'

 module.exports = app => {
    const {existsOrError,notExistOrError,equalOrError,validationEmail} = app.api.validation
    const signin = async (req,res)=> {
        console.log(req.body)
        validationEmail(req.body.email,'email invalido')
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('informe email e senha')
        }

        const user = await app.db('users').where({email: req.body.email}).first()
        console.log(user)
        if(!user) return res.status(400).send('usuario nao encontrado')


        const isEqual = bcrypt.compareSync(req.body.password,user.password)
        if(!isEqual) return res.status(401).send('senha errada')
        const now = Math.floor(Date.now() / 1000)
        const payload = {
            id: user.user_id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now,
            exp: now + (60*60*24*3) 
        }
        return res.json({...payload,token: jwt.encode(payload,secret) })


    }
    const validateToken = async (req,res) => {
        const userData = req.body || null
        try {
            if(userData){
                const token = jwt.decode(userData.token,secret)
             if (new Date(token.exp * 1000) > new Date()) {
                 return res.send(true)
             }
            }
        } catch (error) {
            
        }
        res.send(false)
        
    }
  return {signin,validateToken}
 }