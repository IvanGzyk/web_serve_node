const laraDb = require('../../config/LaraDb')
lara = new laraDb()
const params = lara.GeraParamsUrl()
const ApiLara = lara.ApiLaravel()

function retornaData(data) {
    data = data.data
    data = data.data
    data = data.data
    return data
}

async function getPartnersAdresses(params) {
    try {
        const response = await ApiLara.get(`/entriesBusinessPartnersAddresses${params}`)
        return response
    } catch (error) {
        console.error(error)
    }
}

async function getCities(params) {
    try {
        const response = await ApiLara.get(`/entriesCities${params}`)
        return response
    } catch (error) {
        console.error(error)
    }
}

async function getCountries(params) {
    try {
        const response = await ApiLara.get(`/entriesCountries${params}`)
        return response
    } catch (error) {
        console.error(error)
    }
}

async function getPartners(params) {
    try {
        const response = await ApiLara.get(`/entriesBusinessPartners${params}`)
        return response
    } catch (error) {
        console.error(error)
    }
}

async function postPartners(params) {
    try {
        const response = await ApiLara.post(`/entriesBusinessPartners`, params)
        return response
    } catch (error) {
        console.error(error)
    }
}

async function putPartners(id, params) {
    try {
        const response = await ApiLara.put(`/entriesBusinessPartners/${id}`, params)
        return response
    } catch (error) {
        console.error(error)
    }
}

async function postPartnersAddresses(params) {
    try {
        const response = await ApiLara.post(`/entriesBusinessPartnersAddresses`, params)
        return response
    } catch (error) {
        console.error(error)
    }
}

async function putPartnersAddresses(id, params) {
    try {
        const response = await ApiLara.put(`/entriesBusinessPartnersAddresses/${id}`, params)
        return response
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    retornaData,
    getPartnersAdresses,
    getCities,
    getCountries,
    getPartners,
    postPartners,
    putPartners,
    postPartnersAddresses,
    putPartnersAddresses
}

/** EXEMPLOS */

/** pega Cliente onde email for igual a email */
// const searchLike = encodeURIComponent('email=ppppp%')
// const relations = encodeURIComponent('Relação')
// console.log(searchLike)
// getPartners(`?search=Busca&searchLike=${searchLike}&relations=${relations}`).then(data => {
//     const dados = retornaData(data)
//     console.log(dados.length)
//     console.log(dados)
// })

/** pega Pais onde name for igual a Brasil */
// var search = encodeURI('name=Brasil')

// getCountries(`?search=${search}`).then(data => {
//     const dados = retornaData(data)
//     console.log(dados)
// })

/** Pega cidade e Estado onde name for igual a Curitiba */
// var search = encodeURI('name=Curitiba')
// var relations = encodeURI('Estado')

// getCities(`?search=${search}&relations=${relations}`).then(data => {
//     const dados = retornaData(data)
//     console.log(dados)
// })

/** Pega Endereços */
//getPartnersAdsresses(params).then(console.log)

/** Cadastra novo Cliente */

// var jsonCliente = {
//     "company_name": "Teste2",
//     "cpf": "13345876951",
//     "birth_date": "2022-02-17",
//     "email": "teste2@teste2.com"
// }

// postPartners(jsonCliente).then(data => {
//     data = data.data.data
//     idCliente = data.id
//     var search = encodeURI('name=Curitiba')
//     var relations = encodeURI('Estado')
//     getCities(`?search=${search}&relations=${relations}`).then(data => {
//         let dados = retornaData(data)
//         dados = dados[0]
//         city_id = dados.id
//         state_id = dados.state_id
//         var jsonEndereco = {
//             "entries_business_partner_id": idCliente,
//             "zip": "8457891",
//             "address": "R. Teste, n. 1000",
//             "city_id": city_id,
//             "state_id": state_id,
//             "country_id": 1
//         }
//         postPartnersAddresses(jsonEndereco).then(console.log)
//     })
// })