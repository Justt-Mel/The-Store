const express = require('express')
const app = express.Router()
const {
    newCustomer,
    fetchCustomer,
    newProduct,
    fetchProduct,
    newFavorite,
    fetchFavorite,
    deleteFavorite,
    fetchCustFaves
} = require('./storeDb')

app.get('/customers',async ( req, res, next) => {
    try {
        res.send(await fetchCustomer())
    } catch (error) {
        next(error)
    }
})

app.post('/customers', async ( req, res, next) => {
    try {
        res.send(await newCustomer(req.body))
    } catch (error) {
        next(error)
    }
})

app.get('/products',async ( req, res, next) => {
    try {
        res.send(await fetchProduct())
    } catch (error) {
        next(error)
    }
})

app.post('/products',async ( req, res, next) => {
    try {
        res.send(await newProduct(req.body))
    } catch (error) {
        next(error)
    }
})

app.get('/favorite',async ( req, res, next) => {
    try {
        res.send(await fetchFavorite())
    } catch (error) {
        next(error)
    }
})

app.post('/products',async ( req, res, next) => {
    try {
        res.send(await newProduct(req.body))
    } catch (error) {
        next(error)
    }
})

app.post('/favorite',async ( req, res, next) => {
    try {
        res.send(await newFavorite(req.body))
    } catch (error) {
        next(error)
    }
})

app.get('/customers/:id/favorite', async (req, res, next) => {
    try {
        res.send(await fetchCustFaves(req.params.id))
    } catch (error) {
        next(error)
    }
})

app.delete('/favorite/:id/customers/:customers_id',async ( req, res, next) => {
    try {
        await deleteFavorite({id: req.params.id, customers_id: req.params.customers_id})
        res.sendStatus(201)
    } catch (error) {
        next(error)
    }
})

module.exports = app