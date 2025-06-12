const express = require('express')
const app = express()
app.use(express.json())
const {
    client,
    seed
} = require('./storeDb')
app.use ('/api', require ('./api'))

const init = async () =>{
    await client.connect();
    seed()
    const PORT = 3000
    app.listen(PORT, ()=> {
        console.log(`connected to ${PORT}`);
    })
}
init();