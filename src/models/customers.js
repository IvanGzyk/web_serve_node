const Sequelize = require('sequelize');
const db = require("../../config/db").sequelize

/** Cria a tabela caso não exista */
const Customer = db.define('api_customers', {
    customer_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id: {
        type: Sequelize.INTEGER
    },
    group_id: {
        type: Sequelize.INTEGER
    },
    default_billing: {
        type: Sequelize.STRING(100)
    },
    default_shipping: {
        type: Sequelize.STRING(100)
    },
    confirmation: {
        type: Sequelize.STRING(100)
    },
    created_at: {
        type: Sequelize.STRING(100)
    },
    updated_at: {
        type: Sequelize.STRING(100)
    },
    created_in: {
        type: Sequelize.STRING(100)
    },
    dob: {
        type: Sequelize.STRING(100)
    },
    email: {
        type: Sequelize.STRING(100)
    },
    firstname: {
        type: Sequelize.STRING(100)
    },
    lastname: {
        type: Sequelize.STRING(100)
    },
    middlename: {
        type: Sequelize.STRING(100)
    },
    prefix: {
        type: Sequelize.STRING(100)
    },
    suffix: {
        type: Sequelize.STRING(100)
    },
    gender: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    store_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    taxvat: { type: Sequelize.STRING(100) }
},
    {
        indexes: [
            {
                unique: true,
                fields: ['customer_id']
            },
            {
                unique: true,
                fields: ['taxvat']
            }
        ]
    })
Customer.sync()

/** Cria novo customer*/
function createCustomer(array) {
    Customer.create(
        array
    )
}

/**  */

/**Traz Customer especifico */
async function getCustomer(id_) {
    try {
        const customer = Customer.findAll({
            where: {
                id: id_
            }
        })
        return customer
    } catch (error) {
        console.log(error)
    }
}

/**Traz todos os Customers */
async function getCustomers() {
    try {
        const customer = Customer.findAll()
        return customer
    } catch (error) {
        console.log(error)
    }
}

/**Atualiza Customer especifico */
async function updateCustomer(array, id_) {
    try {
        const customer = await Customer.update(
            array,
            {
                where: {
                    id: id_
                }
            })
        return customer
    } catch (error) {
        console.log(error)
    }
}

/**Deleta Customer especifico */
async function deleteCustomer(id_) {
    try {
        await Customer.destroy({
            where: {
                id: id_
            }
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports.Customer = Customer
module.exports.createCustomer = createCustomer
module.exports.getCustomer = getCustomer
module.exports.getCustomers = getCustomers
module.exports.updateCustomer = updateCustomer
module.exports.deleteCustomer = deleteCustomer