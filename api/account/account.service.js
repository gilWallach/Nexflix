const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getAccountById,
    getAccountByEmail,
    deleteAccount,
    addAccount,
    addProfile,
    updateProfile,
    deleteProfile,
    updateWatchList,
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('account')
        var accounts = await collection.find(criteria).toArray()
        // var accounts = await collection.find(criteria).sort({nickname: -1}).toArray()
        accounts = accounts.map(account => {
            delete account.password
            // // account.isHappy = true
            account.createdAt = new ObjectId(account._id).getTimestamp()
            return account
        })
        return accounts
    } catch (err) {
        logger.error('cannot find accounts', err)
        throw err
    }
}

async function getAccountById(accountId) {
    try {
        const collection = await dbService.getCollection('account')

        const account = await collection.findOne({ _id: new ObjectId(accountId) })
        delete account.password
        return account
    } catch (err) {
        logger.error(`while finding account by id: ${accountId}`, err)
        throw err
    }
}

async function getAccountByEmail(email) {
    try {
        const collection = await dbService.getCollection('account')
        const account = await collection.findOne({ email })
        return account
    } catch (err) {
        logger.error(`while finding account by email: ${email}`, err)
        throw err
    }
}

async function addAccount(account) {
    try {
        const accountToAdd = {
            email: account.email,
            password: account.password,
            profiles: [
                {
                    _id: new ObjectId(),
                    profileName: account.email.substring(0, account.email.indexOf("@")),
                    isOwner: account.isOwner,
                    color: "#86a546",
                    watchList: []
                }
            ]
        }
        const collection = await dbService.getCollection('account')
        await collection.insertOne(accountToAdd)
        return accountToAdd
    } catch (err) {
        logger.error('cannot insert account', err)
        throw err
    }
}

async function deleteAccount(accountId) {
    try {
        const collection = await dbService.getCollection('account')
        await collection.deleteOne({ _id: new ObjectId(accountId) })
    } catch (err) {
        logger.error(`cannot delete account ${accountId}`, err)
        throw err
    }
}

async function addProfile(accountId, newProfile) {
    try {
        const profileToAdd = {
            _id: new ObjectId(),
            profileName: newProfile.profileName,
            isOwner: false,
            color: newProfile.color,
            watchList: []
        }

        const collection = await dbService.getCollection('account')

        await collection.updateOne(
            { _id: new ObjectId(accountId) },
            { $push: { profiles: profileToAdd } }
        )

        const account = await collection.findOne({ _id: new ObjectId(accountId) })
        return account
    } catch (err) {
        logger.error(`Failed to add profile`, err)
        throw err
    }
}

async function updateProfile(accountId, profile) {
    try {
        const collection = await dbService.getCollection('account')

        const profileObjId = typeof profile._id === "string" ? new ObjectId(profile._id) : profile._id

        const profileToSave = {
            ...profile,
            _id: profileObjId
        }

        await collection.updateOne(
            { _id: new ObjectId(accountId), 'profiles._id': profileObjId },
            {
                $set: {
                    'profiles.$': profileToSave,
                },
            }
        )

        const account = await collection.findOne({ _id: new ObjectId(accountId) })
        return account
    } catch (err) {
        logger.error(`Failed to update profile`, err)
        throw err
    }
}

// TODO: FIX! currently deletes the entire account instead of just the profile
async function deleteProfile(accountId, profileId) {
    try {
        const collection = await dbService.getCollection('account')

        // const accountObjId = typeof accountId === "string" ? new ObjectId(accountId) : accountId
        // const profileObjId = typeof profileId === "string" ? new ObjectId(profileId) : profileId

        await collection.updateOne(
            { _id: new ObjectId(accountId) },
            { $pull: { profiles: { _id: new ObjectId(profileId) } } }
        );
        const account = await collection.findOne({ _id: new ObjectId(accountId) })
        return account
    } catch (err) {
        logger.error(`Failed to delete profile`, err)
        throw err
    }
}

async function updateWatchList(accountId, profileId, newWatchList) {
    try {
        // const accountObjId = typeof accountId === "string" ? new ObjectId(accountId) : accountId
        // const profileObjId = typeof profileId === "string" ? new ObjectId(profileId) : profileId

        const collection = await dbService.getCollection('account')
        await collection.updateMany(
            { _id: new ObjectId(accountId), 'profiles._id': new ObjectId(profileId) },
            { $set: { 'profiles.$.watchList': newWatchList } })
        const account = await collection.findOne({ _id: new ObjectId(accountId) })
        return account
    } catch (err) {
        logger.error(`while updating watchList`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                accountname: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    if (filterBy.minBalance) {
        criteria.balance = { $gte: filterBy.minBalance }
    }
    return criteria
}


