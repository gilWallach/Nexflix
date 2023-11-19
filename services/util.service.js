module.exports = {
    getRandomNum
}

function getRandomNum(length) {
    return Math.floor(Math.random() * length - 1)
}