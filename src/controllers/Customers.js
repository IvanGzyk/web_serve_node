
const CronJob = require('cron').CronJob
const Addres = require('../models/address')
const ModelsCustomers = require('../models/customers')
const IntegracaoCustomers = require('../integracao/customers')

class Customers {
    constructor(){

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
}

module.exports.Customers = new Customers()