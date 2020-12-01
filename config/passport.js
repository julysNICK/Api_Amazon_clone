const passport = require('passport')
const passportJwt = require('passport-jwt')
const secret = 'uhefuiwhfueihjgnsnjs'
const {Strategy,ExtractJwt } = passportJwt

module.exports = app => {
    const params = {
        secretOrKey: secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }
    const strategy = new Strategy(params, (payload, done) => {
         app.db('users')
            .where({user_id: payload.id})
            .first()
            .then(user => done(null, user ? {...payload}:false))
            .catch(err => done(err, false))
    })
    passport.use(strategy)

    return {
        authenticate: () => passport.authenticate('jwt',{session:false})
    }
}
