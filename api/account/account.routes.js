const express = require('express')
// const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getAccount, getAccounts, deleteAccount, updateAccount, updateWatchList, addProfile, updateProfile, deleteProfile} = require('./account.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getAccounts)
router.get('/:accountId', getAccount)
router.delete('/:accountId', deleteAccount)
router.put('/:accountId/profile/:profileId/update-watchlist', updateWatchList)
router.put('/:accountId/profile', updateProfile)
router.post('/:accountId/profile', addProfile)
router.delete('/:accountId/profile/:profileId', deleteProfile)

module.exports = router