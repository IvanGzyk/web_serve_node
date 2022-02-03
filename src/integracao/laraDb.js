const laraDb = require('../../config/LaraDb')
lara = new laraDb(20, 1, 'company_name', 'ASC', 'id, HRD_D024_Id, company_name, trading_name, cnpj, cpf, ie, flag_custumer_supplier, flag_resseler_consumer, flag_legal_entity, flag_simplified_taxation, flag_suframa, flag_mei, birth_date, note, email, email_nfe, email_billing, limit_value, limit_manual_value, limit_manual_date, limit_balance', 'id=1', 'Incremental', 'Rela%C3%A7%C3%A3o')

function retornaData(data) {
    data = data.data
    data = data.data
    data = data.data
    //console.log(data)
    return data
}

const partners = async function data() {
    try {
        const response = await lara.EntriesBusinessPartners()
        return retornaData(response)
    } catch (error) {
        console.error(error)
    }
} 

partners().then(console.log)