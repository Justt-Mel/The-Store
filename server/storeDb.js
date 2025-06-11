const pg = require('pg');
const client = new pg.Client('postgres://artma:postgres@localhost/the_store');
const {v4}= require('uuid') 
const uuidv4 = v4



const seed = async () => {
    const SQL = `
    DROP TABLE IF EXISTS favorite_prod;
    DROP TABLE IF EXISTS customers;
    DROP TABLE IF EXISTS products;
    CREATE TABLE products(
    id UUID PRIMARY KEY,
    product_name VARCHAR(50),
    product_price INT, 
    product_quantity INT
    );
    CREATE TABLE customers(
    id UUID PRIMARY KEY,
    customer_name VARCHAR(50) UNIQUE
    );
    CREATE TABLE favorite_prod(
    id UUID PRIMARY KEY,
    customers_id UUID REFERENCES customers(id) NOT NULL, 
    product_id UUID REFERENCES products(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
    );
    `
    await client.query(SQL)
    console.log("Tables Created")
}

module.exports = {
    client,
    seed
};