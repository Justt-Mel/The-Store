const express = require('express')
const app = express.Router()
const {
newCustomer,
    fetchCustomer,
    newProduct,
    fetchProduct,
    newFavorite,
    fetchFavorite,
    deleteFavorite
} = require('./storeDb')

app.get('./customers',async (req, res, next) => {
    try {
        res.send(await fetchCustomer)
    } catch (error) {
        next(error)
    }
})