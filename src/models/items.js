const Sequelize = require('sequelize');
const db = require("../../config/db").sequelize

/** Cria a tabela caso não exista */
const item = db.define('api_items', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    amount_refunded: {
        type: Sequelize.INTEGER
    },
    base_amount_refunded: {
        type: Sequelize.INTEGER
    },
    base_discount_amount: {
        type: Sequelize.INTEGER
    },
    base_discount_invoiced: {
        type: Sequelize.INTEGER
    },
    base_discount_tax_compensation_amount: {
        type: Sequelize.INTEGER
    },
    base_discount_tax_compensation_invoiced: {
        type: Sequelize.INTEGER
    },
    base_original_price: {
        type: Sequelize.FLOAT
    },
    base_price: {
        type: Sequelize.FLOAT
    },
    base_price_incl_tax: {
        type: Sequelize.FLOAT
    },
    base_row_invoiced: {
        type: Sequelize.FLOAT
    },
    base_row_total: {
        type: Sequelize.FLOAT
    },
    base_row_total_incl_tax: {
        type: Sequelize.FLOAT
    },
    base_tax_amount: {
        type: Sequelize.INTEGER
    },
    base_tax_invoiced: {
        type: Sequelize.INTEGER
    },
    created_at: {
        type: Sequelize.DATE
    },
    discount_amount: {
        type: Sequelize.INTEGER
    },
    discount_invoiced: {
        type: Sequelize.INTEGER
    },
    discount_percent: {
        type: Sequelize.INTEGER
    },
    free_shipping: {
        type: Sequelize.INTEGER
    },
    discount_tax_compensation_amount: {
        type: Sequelize.INTEGER
    },
    discount_tax_compensation_invoiced: {
        type: Sequelize.INTEGER
    },
    is_qty_decimal: {
        type: Sequelize.INTEGER
    },
    is_virtual: {
        type: Sequelize.INTEGER
    },
    item_id: {
        type: Sequelize.INTEGER
    },
    name: {
        type: Sequelize.STRING
    },
    no_discount: {
        type: Sequelize.INTEGER
    },
    order_id: {
        type: Sequelize.INTEGER
    },
    original_price: {
        type: Sequelize.FLOAT
    },
    price: {
        type: Sequelize.FLOAT
    },
    price_incl_tax: {
        type: Sequelize.FLOAT
    },
    product_id: {
        type: Sequelize.INTEGER
    },
    product_type: {
        type: Sequelize.STRING
    },
    qty_canceled: {
        type: Sequelize.INTEGER
    },
    qty_invoiced: {
        type: Sequelize.INTEGER
    },
    qty_ordered: {
        type: Sequelize.INTEGER
    },
    qty_refunded: {
        type: Sequelize.INTEGER
    },
    qty_shipped: {
        type: Sequelize.INTEGER
    },
    quote_item_id: {
        type: Sequelize.INTEGER
    },
    row_invoiced: {
        type: Sequelize.FLOAT
    },
    row_total: {
        type: Sequelize.FLOAT
    },
    row_total_incl_tax: {
        type: Sequelize.FLOAT
    },
    row_weight: {
        type: Sequelize.INTEGER
    },
    sku: {
        type: Sequelize.STRING
    },
    store_id: {
        type: Sequelize.INTEGER
    },
    tax_amount: {
        type: Sequelize.INTEGER
    },
    tax_invoiced: {
        type: Sequelize.INTEGER
    },
    tax_percent: {
        type: Sequelize.INTEGER
    },
    updated_at: {
        type: Sequelize.DATE
    },
    weee_tax_applied: {
        type: Sequelize.JSON
    }
},
{
    indexes: [
        {
            unique: true,
            fields: ['order_id']
        }
    ]
})
item.sync()

/** Cria novo items*/
function createItems(array) {
    item.create(
        array
    )
}

/**Traz items especifico */
async function getItem(id_order) {
    try {
        const ite = item.findAll({
            where: {
                order_id: [id_order]
            }
        })
        return ite
    } catch (error) {
        console.log(error)
    }
}

/**Traz todos os itemss */
async function getItems() {
    try {
        const items = item.findAll()
        return items
    } catch (error) {
        console.log(error)
    }
}

/**Atualiza items especifico */
async function updateItems(array, id_) {
    try {
        await item.update(
            array, 
            {
            where: {
                id: id_
            }
        })
    } catch (error) {
        console.log(error)
    }
}

/**Deleta items especifico */
async function deleteItems(id_){
    try{
        await item.destroy({
            where:{
                id: id_
            }
        })
    }catch(error){
        console.log(error)
    }
}

module.exports.item = item
module.exports.createItems = createItems
module.exports.getItem = getItem
module.exports.getItems = getItems
module.exports.updateItems = updateItems
module.exports.deleteItems = deleteItems