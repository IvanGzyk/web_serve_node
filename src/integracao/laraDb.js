const axios = require('axios')

const laraDb = axios.create({
    baseURL: 'http://192.168.11.66:8000/api',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
  })

async function getPartnersAdsresses(params) {
    try {
        const response = await laraDb.get('/entriesBusinessPartners', params);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

const params = {
    'limit': 15,
    'page': 1,
    'order': 'company_name',
    'direction': 'ASC',
    'fields': 'id, HRD_D024_Id, company_name, trading_name, cnpj, cpf, ie, flag_custumer_supplier, flag_resseler_consumer, flag_legal_entity, flag_simplified_taxation, flag_suframa, flag_mei, birth_date, note, email, email_nfe, email_billing, limit_value, limit_manual_value, limit_manual_date, limit_balance',
    'search': 'Busca',
    'searchLike': 'Incremental',
    'relations': 'Relação'
}

getPartnersAdsresses(params)