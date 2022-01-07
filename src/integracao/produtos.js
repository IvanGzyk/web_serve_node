const mage = require("../../config/conexao_mage")

const client = mage.client


const getProdutos = async function () {
    try {
        let dados = await client.get('products')
        return dados
    } catch (err) {
        console.log(err)
    }
}

const getProduto = async function (codigo) {
    try {
        let dados = await client.get('products', { sku: codigo })
        return dados
    } catch (err) {
        console.log(err)
    }
}

const postProduto = async function (json) {
    try {
        let dados = await client.post('products', json)
        return dados
    } catch (err) {
        console.log(err.response.data.message)
    }
}

const putProduto = async function (sku, json) {
    try {
        let dados = await client.put(`products/${sku}`, json)
        return dados
    } catch (err) {
        console.log(err.response.data.message)
    }
}

const deleteProduto = async function (sku) {
    try {
        let dados = await client.delete(`products/${sku}`)
        return dados
    } catch (err) {
        console.log(err.response.data.message)
    }
}


module.exports = { client, getProdutos, getProduto, postProduto, putProduto, deleteProduto}