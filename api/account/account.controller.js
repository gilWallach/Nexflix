const accountService = require('./account.service')
const logger = require('../../services/logger.service')

async function getAccount(req, res) {
    try {
        const account = await accountService.getById(req.params.accountId)
        res.send(account)
    } catch (err) {
        logger.error(`Failed to get account with id: ${req.params.id}`, err)
        res.status(500).send({ err: 'Failed to get account' })
    }
}

async function getAccounts(req, res) {
    try {
        const filterBy = {
            // txt: req.query?.txt || '',
            // minBalance: +req.query?.minBalance || 0
        }
        const accounts = await accountService.query(filterBy)
        res.send(accounts)
    } catch (err) {
        logger.error('Failed to get accounts', err)
        res.status(500).send({ err: 'Failed to get accounts' })
    }
}

async function updateWatchList(req, res) {
    const { accountId, profileId } = req.params
    const newWatchList = req.body
    try {
        const account = await accountService.updateWatchList(accountId, profileId, newWatchList)
        res.send(account)
    } catch (err) {
        logger.error(`Failed to update watchList`, err)
        res.status(500).send({ err: 'Failed to update watchList' })
    }
}

async function deleteAccount(req, res) {
    try {
        await accountService.deleteAccount(req.params.accountId)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error(`Failed to delete account with id ${req.params.id}`, err)
        res.status(500).send({ err: 'Failed to delete account' })
    }
}

async function updateAccount(req, res) {
    try {
        const account = await accountService.getById(req.params.id)
        const fields = req.body
        const savedAccount = await accountService.update({ ...account, ...fields })
        res.send(savedAccount)
    } catch (err) {
        logger.error('Failed to update account', err)
        res.status(500).send({ err: 'Failed to update account' })
    }
}

async function addProfile(req, res) {
    try {
        const { accountId } = req.params
        const newProfile = req.body

        const updatedAccount = await accountService.addProfile(accountId, newProfile)
        res.send(updatedAccount)
    } catch (err) {
        logger.error('Failed to add profile', err)
        res.status(500).send({ err: 'Failed to add profile' })
    }
}

async function updateProfile(req, res) {
    try {
        const { accountId } = req.params
        const profile = req.body

        const updatedAccount = await accountService.updateProfile(accountId, profile)
        res.send(updatedAccount)
    } catch (err) {
        logger.error('Failed to update profile', err)
        res.status(500).send({ err: 'Failed to update profile' })
    }
}

async function deleteProfile(req, res) {
    try {
        const {accountId, profileId} = req.params
        const updatedAccount = await accountService.deleteProfile(accountId, profileId)
        res.send(updatedAccount)
    } catch (err) {
        logger.error('Failed to delete profile', err)
        res.status(500).send({ err: 'Failed to delete profile' })
    }
}

module.exports = {
    getAccount,
    getAccounts,
    updateWatchList,
    addProfile,
    updateProfile,
    deleteAccount,
    updateAccount,
    deleteProfile
}