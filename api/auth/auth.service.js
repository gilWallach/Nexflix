const Cryptr = require('cryptr')

const bcrypt = require('bcrypt')
const accountService = require('../account/account.service')
const logger = require('../../services/logger.service')

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

async function login(email, password) {
    const account = await accountService.getAccountByEmail(email)
    if (!account) return Promise.reject('Invalid email or password')

    const match = await bcrypt.compare(password, account.password)
    if (!match) return Promise.reject('Invalid email or password')

    delete account.password
    return account
}

async function signup(email, password, isOwner = true) {
    const saltRounds = 10
    
    if (!email || !password) return Promise.reject('Email and password are required!')

    const userExist = await accountService.getAccountByEmail(email)
    if (userExist) return Promise.reject('Email already exists')

    const hash = await bcrypt.hash(password, saltRounds)
    return accountService.addAccount({ email, password: hash, isOwner })
}

function getLoginToken(account) {
    return cryptr.encrypt(JSON.stringify(account))    
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedInAccount = JSON.parse(json)
        return loggedInAccount
    } catch(err) {
        console.log('Invalid login token')
    }
    return null
}



module.exports = {
    signup,
    login,
    getLoginToken,
    validateToken
}