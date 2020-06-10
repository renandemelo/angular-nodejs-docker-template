const constants = require('./constants')
const ADMIN_PASSWORD = constants.ADMIN_PASSWORD

const loggedIn = async (req, res) =>{
    res.send({loggedIn: !!req.session.loggedIn})
}

const login = async (req, res) => {
    const {username, password} = req.body
    if(username === 'admin' && password === ADMIN_PASSWORD){
        req.session.loggedIn = true
        res.send({ success: true });
    } else{
        res.send({ success: false, error: 'Invalid username/password!'})
    }
}

module.exports = {
    loggedIn: loggedIn,
    login: login
}