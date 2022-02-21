const mage = require("../../config/conexao_mage")
const client = mage.client

const getCustomers = async function (params) {

    try {
        let dados = await client.get('customers/search', params)
        return dados
    } catch (err) {
        console.log(err)
    }
}

const getCustomer = async function (codigo) {
    try {
        let dados = await client.get('customers', { sku: codigo })
        return dados
    } catch (err) {
        console.log(err)
    }
}

const postCustomer = async function (json) {
    try {
        let dados = await client.post('customers', json)
        return dados
    } catch (err) {
        console.log(err.response.data.message)
    }
}

const putCustomer = async function (sku, json) {
    try {
        let dados = await client.put(`customers/${sku}`, json)
        return dados
    } catch (err) {
        console.log(err.response.data.message)
    }
}

const deleteCustomer = async function (sku) {
    try {
        let dados = await client.delete(`customers/${sku}`)
        return dados
    } catch (err) {
        console.log(err.response.data.message)
    }
}

const getshippingAddress = async function (customer_id) {
    try {
        let dados = await client.get(`customers/${customer_id}/shippingAddress`)
        return dados
    } catch (err) {
        console.log(err)
    }
}

module.exports = { client, getCustomers, getCustomer, postCustomer, putCustomer, deleteCustomer, getshippingAddress}