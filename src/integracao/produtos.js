const mage = require("../../config/conexao_mage")

const client = mage.client


const getProdutos = async function () {
    try {
        let dados = await client.get('products')
        return dados
    } catch (err) {
        console.log(err.response.data.message)
    }
}

const getProduto = async function (codigo) {
    try {
        let dados = await client.get('products', { sku: codigo })
        return dados
    } catch (err) {
        console.log(err.response)
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

const addProdutoSimple = async function (sku, json){
    try {
        let dados = await client.post(`configurable-products/${sku}/child`, json)
        return dados
    } catch (err){
        console.log(err.response.data.message)
    }
}

const ProdutoConfigurableOptions = async function (sku, json){
    try {
        let dados = await client.post(`configurable-products/${sku}/options`, json)
        return dados
    } catch (err){
        console.log(err.response.data.message)
    }
}

const GetProdutosAtributos = async function (params){
    try {
        let dados = await client.get(`products/attributes`, params)
        return dados
    } catch (err){
        console.log(err.response)
    }
}

const putProdutosAtributos = async function (aributeCode, params){
    try {
        let dados = await client.put(`products/attributes/${aributeCode}`, params)
        return dados
    } catch (err){
        console.log(err.response.data.message)
    }
}

const postProdutosAtributos = async function (params){
    try {
        let dados = await client.post(`products/attributes`, params)
        return dados
    } catch (err){
        console.log(err.response.data.message)
    }
}

const getGrupoAtributosSet = async function (params){
    try {
        let dados = await client.get(`products/attribute-sets/sets/list`, params)
        return dados
    } catch (err){
        console.log(err.response.data.message)
    }
}

const postGrupoAtributos = async function (params){
    try {
        let dados = await client.post(`products/attribute-sets`, params)
        return dados
    } catch (err){
        console.log(err.response.data.message)
    }
}



module.exports = { 
    client, 
    getProdutos, 
    getProduto, 
    postProduto, 
    putProduto, 
    deleteProduto, 
    addProdutoSimple, 
    ProdutoConfigurableOptions, 
    GetProdutosAtributos, 
    putProdutosAtributos,
    postProdutosAtributos,
    getGrupoAtributosSet,
    postGrupoAtributos
}