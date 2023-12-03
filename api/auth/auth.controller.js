const authService = require('./auth.service')
const logger = require('../../services/logger.service')

async function login(req, res) {
    const { email, password } = req.body
    try {
        const account = await authService.login(email, password)
        const loginToken = authService.getLoginToken(account)
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        res.json(account)
    } catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(500).send({ err: `Failed to Login: ${err}` })
    }
}

async function signup(req, res) {
    const { email, password } = req.body
    try {
        const account = await authService.signup(email, password)
        const loginToken = authService.getLoginToken(account)
        
        res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
        res.json(account)
    } catch (error) {
        logger.error('Failed to signup ' + error)
        res.status(500).send({ err: `Failed to signup: ${error}` })
    }
}

async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to logout' })
    }
}

module.exports = {
    login,
    signup,
    logout
}