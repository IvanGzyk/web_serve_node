const mage = require("../../config/conexao_mage")
const CronJob = require('cron').CronJob

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

function salvaCustomers(dados){
    console.log(dados.items.length)
    const retorno = dados.items
    retorno.forEach(element => {
        console.log(element)
    })
    console.log(dados.items)
}

const job = new CronJob('0 * * * * *', () => {
    
    var data = new Date()
    var dia = String(data.getDate()).padStart(2, '0')
    var mes = String(data.getMonth() + 1).padStart(2, '0')
    var ano = data.getFullYear()
    var hora = String(data.getHours() + 3).padStart(2, '0')
    var minuto = String(data.getMinutes()).padStart(2, '0')
    var minuto_inicio = String(data.getMinutes() - 30).padStart(2, '0')
    var segundos = String(data.getSeconds()).padStart(2, '0')
    data_atual = ano+'-'+mes+'-'+dia+' '+hora+':'+minuto+':'+segundos
    data_inicio = (ano - 1)+'-'+mes+'-'+dia+' '+hora+':'+minuto_inicio+':'+segundos

    let params = {
        $from: data_inicio,
        $to: data_atual,
        $sort: {
            "created_at": "desc"
        },
        $perPage: 200,
        $page: 1
    }
    getCustomers(params).then(data => data.data).then(items => salvaCustomers(items))
    console.log(data_atual +' - '+data_inicio)
}, null, true, 'America/Sao_Paulo')


module.exports = { client, getCustomers, getCustomer, postCustomer, putCustomer, deleteCustomer}