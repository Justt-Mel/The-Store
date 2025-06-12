const pg = require('pg');
const client = new pg.Client('postgres://artma:postgres@localhost/the_store');
const {v4}= require('uuid') 
const uuidv4 = v4
const bcrypt = require('bcrypt')

const newProduct = async (product) => {
    const SQL = `
    INSERT INTO products (id, product_name, product_price, product_quantity)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `
    const response = await client.query(SQL,[uuidv4(),product.product_name, product.product_price, product.product_quanity])
    return response.rows[0]
};

const fetchProduct = async () => {
    const SQL = `
    SELECT *
    FROM products
    `
    const response = await client.query(SQL)
    return response.rows
};

const newCustomer = async (customer) => {
    if (!customer.customer_name.trim() || !customer.customer_password.trim()){
        throw Error('must have a name and password')
    }

    customer.customer_password = await bcrypt.hash(customer.customer_password, 5)

    const SQL = `
    INSERT INTO customers (id, customer_name,customer_password)
    VALUES ($1,$2,$3)
    RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), customer.customer_name, customer.customer_password])
    return response.rows[0]
};

const fetchCustomer = async () => {
    const SQL = `
    SELECT *
    FROM customers
    `
    const response = await client.query(SQL)
    return response.rows
};

const fetchCustFaves = async (customers_id) => {
    const SQL= `
    SELECT *
    FROM favorite_prod
    WHERE customers_id = $1
    `
    const response = await client.query(SQL, [customers_id])
    return response.rows
};

const newFavorite = async (favorite) =>{
    const SQL = `
    INSERT INTO favorite_prod (id, customers_id, products_id)
    VALUES ($1,$2,$3)
    RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), favorite.customers_id, favorite.products_id])
    response.rows[0]
};

const fetchFavorite = async () => {
    const SQL = `
    SELECT *
    FROM favorite_prod
    `
    const response = await client.query(SQL)
    return response.rows
};

const deleteFavorite = async (delFave) => {
    const SQL = `
    DELETE FROM favorite_prod
    WHERE id = $1 and customers_id = $2
    `
    await client.query(SQL,[delFave.id, delFave.customers_id])
};

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
    customer_password VARCHAR(100) NOT NULL
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

    const [rtx5070,keyboard,headphones,powerbank] = await Promise.all([
        newProduct({product_name:'rtx5070', product_price: 700, product_quanity: 0}),
        newProduct({product_name:'keyboard', product_price: 60, product_quanity: 65}),
        newProduct({product_name:'headphones', product_price: 150, product_quanity: 100}),
        newProduct({product_name:'powerbank', product_price: 35, product_quanity: 12})
    ])

   const [David,Gabe,Houston,Cyrus] = await Promise.all([
        newCustomer({customer_name:'David', customer_password: '1234hey'}),
        newCustomer({customer_name:'Gabe', customer_password: '12'}),
        newCustomer({customer_name:'Houston', customer_password: '453'}),
        newCustomer({customer_name:'Cyrus', customer_password: 'hello'})
    ])

    await Promise.all([
        newFavorite({customers_id: David.id , products_id: rtx5070.id}),
        newFavorite({customers_id: Cyrus.id , products_id: headphones.id}),
        newFavorite({customers_id: Gabe.id , products_id: keyboard.id}),
         newFavorite({customers_id: David.id , products_id: headphones.id}),
        newFavorite({customers_id: Houston.id , products_id: powerbank.id})
    ])
};

module.exports = {
    client,
    seed,
    newCustomer,
    fetchCustomer,
    newProduct,
    fetchProduct,
    newFavorite,
    fetchFavorite,
    deleteFavorite,
    fetchCustFaves
};