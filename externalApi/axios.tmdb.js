const Axios = require("axios")
const dotenv = require('dotenv')
dotenv.config()

const API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3/'

module.exports = {
  async get(endpoint, data = {}) {
    try {
      data["api_key"] = API_KEY
      data["page"] = getRandomNum(99)
      
      const url = new URL(`${BASE_URL}${endpoint}`)
      url.search = new URLSearchParams(data)
      const response = await axios.get(url)
      return response.data
    } catch (err) {
      console.log(`Had Issues ${method}ING to the backend, endpoint: ${endpoint}`)
      console.dir(err)
      if (err.response && err.response.status === 401) {
        sessionStorage.clear()
        window.location.assign('/')
      }
      throw err
    }  }
}

const axios = Axios.create({
  withCredentials: true
})

const getRandomNum = (length) => {
  return Math.floor(Math.random() * length - 1)
}
