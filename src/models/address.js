const Sequelize = require('sequelize');
const db = require("../../config/db").sequelize
/** Cria a tabela caso não exista */
const Address = db.define('api_address', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    address_type: {
        type: Sequelize.STRING
    },
    city: {
        type: Sequelize.STRING
    },
    company: {
        type: Sequelize.STRING
    },
    country_id: {
        type: Sequelize.STRING
    },
    customer_address_id: {
        type: Sequelize.INTEGER
    },
    customer_id: {
        type: Sequelize.INTEGER
    },
    email: {
        type: Sequelize.STRING
    },
    entity_id: {
        type: Sequelize.INTEGER
    },
    fax: {
        type: Sequelize.STRING
    },
    firstname: {
        type: Sequelize.STRING
    },
    lastname: {
        type: Sequelize.STRING
    },
    middlename: {
        type: Sequelize.STRING
    },
    parent_id: {
        type: Sequelize.INTEGER
    },
    postcode: {
        type: Sequelize.STRING
    },
    prefix: {
        type: Sequelize.STRING
    },
    region: {
        type: Sequelize.STRING
    },
    region_code: {
        type: Sequelize.STRING
    },
    region_id: {
        type: Sequelize.INTEGER
    },
    street: {
        type: Sequelize.JSON
    },
    suffix: {
        type: Sequelize.STRING
    },
    telephone: {
        type: Sequelize.STRING
    },
    vat_id: {
        type: Sequelize.STRING
    },
    vat_is_valid: {
        type: Sequelize.INTEGER
    },
    vat_request_date: {
        type: Sequelize.STRING
    },
    vat_request_id: {
        type: Sequelize.STRING
    },
    vat_request_success: {
        type: Sequelize.INTEGER
    },
    default_shipping: {
        type: Sequelize.BOOLEAN
    },
    default_billing: {
        type: Sequelize.BOOLEAN
    },
    extension_attributes: {
        type: Sequelize.JSON
    },
    custom_attributes: {
        type: Sequelize.JSON
    }
})

Address.sync()

/** Cria novo address*/
function createAddress(array) {
    Address.create(
        array
    )
}

/**Traz address especifico */
async function getAddress(id_) {
    try {
        const address = Address.findAll({
            where: {
                entity_id: id_
            }
        })
        return address
    } catch (error) {
        console.log(error)
    }
}

/**Traz todos os addresss */
async function getAddresss() {
    try {
        const address = Address.findAll()
        return address
    } catch (error) {
        console.log(error)
    }
}

/**Atualiza address especifico */
async function updateAddress(array, id_) {
    try {
        const address = await Address.update(
            array,
            {
                where: {
                    entity_id: id_
                }
            })
        //return address
    } catch (error) {
        console.log(error)
    }
}

/**Deleta address especifico */
async function deleteAddress(id_) {
    try {
        await Address.destroy({
            where: {
                entity_id: id_
            }
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports.Address = Address
module.exports.createAddress = createAddress
module.exports.getAddress = getAddress
module.exports.getAddresss = getAddresss
module.exports.updateAddress = updateAddress
module.exports.deleteAddress = deleteAddress