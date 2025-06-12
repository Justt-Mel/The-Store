const pg = require('pg');
const client = new pg.Client('postgres://artma:postgres@localhost/the_store');
const {v4}= require('uuid') 
const uuidv4 = v4

const newProduct = async (product) => {
    const SQL = `
    INSERT INTO products (id, product_name, product_price, product_quantity)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `
    const response = await client.query(SQL,[uuidv4(),product.product_name, product.product_price, product.product_quanity])
    return response.rows[0]
}

const fetchProduct = async () => {
    const SQL = `
    SELECT *
    FROM products
    `
    const response = await client.query(SQL)
    return response.rows[0]
}

const newCustomer = async (customer) => {
    const SQL = `
    INSERT INTO customers (id, customer_name,customer_password)
    VALUES ($1,$2,$3)
    RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), customer.customer_name, customer.customer_password])
    return response.rows[0]
}

const fetchCustomer = async () => {
    const SQL = `
    SELECT *
    FROM customers
    `
    const response = await client.query(SQL)
    return response.rows[0]
}

const newFavorite = async (favorite) =>{
    const SQL = `
    INSERT INTO favorite_prod (id, customers_id, products_id)
    VALUES ($1,$2,$3)
    RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(),favorite.customers_id, favorite.products_id])
}

const fetchFavorite = async () => {
    const SQL = `
    SELECT *
    FROM favorite_prod
    `
}

const deleteFavorite = async (id) => {
    const SQL = `
    DELETE FROM favorite_prod
    WHERE id = $1
    `
    await client.query(SQL,[id])
}

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
    customer_name VARCHAR(50) UNIQUE NOT NULL,
    customer_password VARCHAR(50) NOT NULL
    );
    CREATE TABLE favorite_prod(
    id UUID PRIMARY KEY,
    customers_id UUID REFERENCES customers(id) NOT NULL, 
    products_id UUID REFERENCES products(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT product_and_customer_id UNIQUE (products_id, customers_id)
    );
    `
    await client.query(SQL)
    console.log("Tables Created")

    const [rtx5070] = await Promise.all([
        newProduct({product_name:'rtx5070', product_price: 700, product_quanity: 0})
    ])

   const [David] = await Promise.all([
        newCustomer({customer_name:'David', customer_password: '1234hey'})
    ])

    await Promise.all([
        newFavorite({customers_id: David.id , products_id: rtx5070.id})
    ])
}

module.exports = {
    client,
    seed,
    newCustomer,
    fetchCustomer,
    newProduct,
    fetchProduct,
    newFavorite,
    fetchFavorite,
    deleteFavorite
};