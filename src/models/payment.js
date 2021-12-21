const Sequelize = require('sequelize');
const db = require("../../config/db").sequelize

/** Cria a tabela caso não exista */
const Payment = db.define('api_payment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    account_status: {
        type: Sequelize.STRING
    },
    additional_information: {
        type: Sequelize.JSON
    },
    amount_ordered: {
        type: Sequelize.FLOAT
    },
    amount_paid: {
        type: Sequelize.FLOAT
    },
    base_amount_ordered: {
        type: Sequelize.FLOAT
    },
    base_amount_paid: {
        type: Sequelize.FLOAT
    },
    base_shipping_amount: {
        type: Sequelize.INTEGER
    },
    base_shipping_captured: {
        type: Sequelize.INTEGER
    },
    cc_exp_year: {
        type: Sequelize.STRING
    },
    cc_last4: {
        type: Sequelize.STRING
    },
    cc_ss_start_month: {
        type: Sequelize.STRING
    },
    cc_ss_start_year: {
        type: Sequelize.STRING
    },
    entity_id: {
        type: Sequelize.INTEGER
    },
    method: {
        type: Sequelize.STRING
    },
    parent_id: {
        type: Sequelize.INTEGER
    },
    shipping_amount: {
        type: Sequelize.INTEGER
    },
    shipping_captured: {
        type: Sequelize.INTEGER
    }
},
{
    indexes: [
        {
            unique: true,
            fields: ['entity_id']
        }
    ]
}
)
Payment.sync()

/** Cria novo Payment*/
function createPayment(array) {
    Payment.create(
        array
    )
}

/**Traz Payment especifico */
async function getPayment(id_) {
    try {
        const payment = Payment.findAll({
            where: {
                entity_id: id_
            }
        })
        return payment
    } catch (error) {
        console.log(error)
    }
}

/**Traz todos os Payments */
async function getPayments() {
    try {
        const payment = Payment.findAll()
        return payment
    } catch (error) {
        console.log(error)
    }
}

/**Atualiza Payment especifico */
async function updatePayment(array, id_) {
    try {
        const payment = await Payment.update(
            array, 
            {
            where: {
                id: id_
            }
        })
        //return payment
    } catch (error) {
        console.log(error)
    }
}

/**Deleta Payment especifico */
async function deletePayment(id_){
    try{
        await Payment.destroy({
            where:{
                id: id_
            }
        })
    }catch(error){
        console.log(error)
    }
}

module.exports.Payment = Payment
module.exports.createPayment = createPayment
module.exports.getPayment = getPayment
module.exports.getPayments = getPayments
module.exports.updatePayment = updatePayment
module.exports.deletePayment = deletePayment