
const CronJob = require('cron').CronJob
const Addres = require('../models/address')
const ModelsCustomers = require('../models/customers')
const IntegracaoCustomers = require('../integracao/customers')
const IntegracaoLaraDb = require('../integracao/laraDb')

class Customers {
    constructor() {

    }

    SalvaAddress(dados) {
        if (dados.id != undefined) {
            var Address = new Object()
            Address.id = dados.id
            Address.customer_id = dados.customer_id
            Address.region = dados.region
            Address.region_id = dados.region_id
            Address.country_id = dados.country_id
            Address.street = dados.street
            Address.company = dados.company
            Address.telephone = dados.telephone
            Address.fax = dados.fax
            Address.postcode = dados.postcode
            Address.city = dados.city
            Address.firstname = dados.firstname
            Address.lastname = dados.lastname
            Address.middlename = dados.middlename
            Address.prefix = dados.prefix
            Address.suffix = dados.suffix
            Address.vat_id = dados.vat_id
            Address.default_shipping = dados.default_shipping
            Address.default_billing = dados.default_billing
            Address.extension_attributes = dados.extension_attributes
            Address.custom_attributes = dados.custom_attributes
            Addres.getAddress(dados.id).then(ret => {
                if (ret.length == 0) {
                    Addres.createAddress(Address)
                } else if (ret.length == 1) {
                    Addres.updateAddress(Address, dados.id)
                }
            })
        }
    }

    SalvaCustomers(dados) {
        const retorno = dados.items
        retorno.forEach(element => {
            var cliente = new Object()
            cliente.customer_id = element.id
            cliente.group_id = element.group_id
            cliente.default_billing = element.default_billing
            cliente.default_shipping = element.default_shipping
            cliente.confirmation = element.confirmation
            cliente.created_at = element.created_at
            cliente.updated_at = element.updated_at
            cliente.created_in = element.created_in
            cliente.dob = element.dob
            cliente.email = element.email
            cliente.firstname = element.firstname
            cliente.lastname = element.lastname
            cliente.middlename = element.middlename
            cliente.prefix = element.prefix
            cliente.suffix = element.suffix
            cliente.gender = element.gender
            cliente.store_id = element.store_id
            cliente.taxvat = element.taxvat

            ModelsCustomers.getCustomer(element.id).then(ret => {
                if (ret.length == 0) {
                    ModelsCustomers.createCustomer(cliente)
                } else if (ret.length == 1) {
                    ModelsCustomers.updateCustomer(cliente, element.id)
                }
            })
            IntegracaoCustomers.getshippingAddress(element.id).then(dados => dados.data).then(dados => this.SalvaAddress(dados))
        })
    }

    SalvaClienteLaraApi(array) {
        if (array.length) {
            var cpf = ''
            var cnpj = ''
            let api_customers = array[0].dataValues
            if (api_customers.taxvat != null) {
                if (api_customers.taxvat.length <= 14) {
                    cpf = api_customers.taxvat
                } else {
                    cnpj = api_customers.taxvat
                }
            }
            var jsonCliente = {
                "company_name": `${api_customers.firstname} ${api_customers.lastname} ${api_customers.middlename}`,
                "cnpj": `${cnpj}`,
                "cpf": `${cpf}`,
                "email": `${api_customers.email}`
            }
            Addres.getAddressCliente(api_customers.customer_id).then(dados => {
                let api_address = dados[0].dataValues
                IntegracaoLaraDb.postPartners(jsonCliente).then(data => {
                    data = data.data.data
                    let idCliente = data.id
                    let search = encodeURI(`name=${api_address.city}`)
                    let relations = encodeURI('Estado')
                    IntegracaoLaraDb.getCities(`?search=${search}&relations=${relations}`).then(data => {
                        let dados = IntegracaoLaraDb.retornaData(data)
                        dados = dados[0]
                        var jsonEndereco = {
                            "entries_business_partner_id": idCliente,
                            "zip": api_address.postcode,
                            "address": api_address.street[0],
                            "city_id": dados.id,
                            "state_id": dados.state_id,
                            "country_id": 1
                        }
                        console.log(jsonEndereco)
                        IntegracaoLaraDb.postPartnersAddresses(jsonEndereco).then(console.log)
                    })
                })
            })
        }
    }
}

module.exports.Customers = new Customers()