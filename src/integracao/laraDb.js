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

async function getPartnersAdsresses(params) {
    try {
        const response = await ApiLara.get(`/entriesBusinessPartners${params}`)
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

/** EXEMPLOS */

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