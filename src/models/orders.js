const Sequelize = require('sequelize')
const db = require("../../config/db").sequelize

/** Cria a tabela caso não exista */
const Oreder = db.define('api_orders', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    adjustment_negative: {
        type: Sequelize.INTEGER
    },
    adjustment_positive: {
        type: Sequelize.INTEGER
    },
    applied_rule_ids: {
        type: Sequelize.STRING
    },
    base_adjustment_negative: {
        type: Sequelize.INTEGER
    },
    base_adjustment_positive: {
        type: Sequelize.INTEGER
    },
    base_currency_code: {
        type: Sequelize.STRING
    },
    base_discount_amount: {
        type: Sequelize.INTEGER
    },
    base_discount_canceled: {
        type: Sequelize.INTEGER
    },
    base_discount_invoiced: {
        type: Sequelize.INTEGER
    },
    base_discount_refunded: {
        type: Sequelize.INTEGER
    },
    base_grand_total: {
        type: Sequelize.INTEGER
    },
    base_discount_tax_compensation_amount: {
        type: Sequelize.INTEGER
    },
    base_discount_tax_compensation_invoiced: {
        type: Sequelize.INTEGER
    },
    base_discount_tax_compensation_refunded: {
        type: Sequelize.INTEGER
    },
    base_shipping_amount: {
        type: Sequelize.INTEGER
    },
    base_shipping_canceled: {
        type: Sequelize.INTEGER
    },
    base_shipping_discount_amount: {
        type: Sequelize.INTEGER
    },
    base_shipping_discount_tax_compensation_amnt: {
        type: Sequelize.INTEGER
    },
    base_shipping_incl_tax: {
        type: Sequelize.INTEGER
    },
    base_shipping_invoiced: {
        type: Sequelize.INTEGER
    },
    base_shipping_refunded: {
        type: Sequelize.INTEGER
    },
    base_shipping_tax_amount: {
        type: Sequelize.INTEGER
    },
    base_shipping_tax_refunded: {
        type: Sequelize.INTEGER
    },
    base_subtotal: {
        type: Sequelize.INTEGER
    },
    base_subtotal_canceled: {
        type: Sequelize.INTEGER
    },
    base_subtotal_incl_tax: {
        type: Sequelize.INTEGER
    },
    base_subtotal_invoiced: {
        type: Sequelize.INTEGER
    },
    base_subtotal_refunded: {
        type: Sequelize.INTEGER
    },
    base_tax_amount: {
        type: Sequelize.INTEGER
    },
    base_tax_canceled: {
        type: Sequelize.INTEGER
    },
    base_tax_invoiced: {
        type: Sequelize.INTEGER
    },
    base_tax_refunded: {
        type: Sequelize.INTEGER
    },
    base_total_canceled: {
        type: Sequelize.INTEGER
    },
    base_total_due: {
        type: Sequelize.INTEGER
    },
    base_total_invoiced: {
        type: Sequelize.INTEGER
    },
    base_total_invoiced_cost: {
        type: Sequelize.INTEGER
    },
    base_total_offline_refunded: {
        type: Sequelize.INTEGER
    },
    base_total_online_refunded: {
        type: Sequelize.INTEGER
    },
    base_total_paid: {
        type: Sequelize.INTEGER
    },
    base_total_qty_ordered: {
        type: Sequelize.INTEGER
    },
    base_total_refunded: {
        type: Sequelize.INTEGER
    },
    base_to_global_rate: {
        type: Sequelize.INTEGER
    },
    base_to_order_rate: {
        type: Sequelize.INTEGER
    },
    billing_address_id: {
        type: Sequelize.INTEGER
    },
    can_ship_partially: {
        type: Sequelize.INTEGER
    },
    can_ship_partially_item: {
        type: Sequelize.INTEGER
    },
    coupon_code: {
        type: Sequelize.STRING
    },
    created_at: {
        type: Sequelize.STRING
    },
    customer_dob: {
        type: Sequelize.STRING
    },
    customer_email: {
        type: Sequelize.STRING
    },
    customer_firstname: {
        type: Sequelize.STRING
    },
    customer_gender: {
        type: Sequelize.INTEGER
    },
    customer_group_id: {
        type: Sequelize.INTEGER
    },
    customer_id: {
        type: Sequelize.INTEGER
    },
    customer_is_guest: {
        type: Sequelize.INTEGER
    },
    customer_lastname: {
        type: Sequelize.STRING
    },
    customer_middlename: {
        type: Sequelize.STRING
    },
    customer_note: {
        type: Sequelize.STRING
    },
    customer_note_notify: {
        type: Sequelize.INTEGER
    },
    customer_prefix: {
        type: Sequelize.STRING
    },
    customer_suffix: {
        type: Sequelize.STRING
    },
    customer_taxvat: {
        type: Sequelize.STRING
    },
    discount_amount: {
        type: Sequelize.INTEGER
    },
    discount_canceled: {
        type: Sequelize.INTEGER
    },
    discount_description: {
        type: Sequelize.STRING
    },
    discount_invoiced: {
        type: Sequelize.INTEGER
    },
    discount_refunded: {
        type: Sequelize.INTEGER
    },
    edit_increment: {
        type: Sequelize.INTEGER
    },
    email_sent: {
        type: Sequelize.INTEGER
    },
    entity_id: {
        type: Sequelize.INTEGER
    },
    ext_customer_id: {
        type: Sequelize.STRING
    },
    ext_order_id: {
        type: Sequelize.STRING
    },
    forced_shipment_with_invoice: {
        type: Sequelize.INTEGER
    },
    global_currency_code: {
        type: Sequelize.STRING
    },
    grand_total: {
        type: Sequelize.INTEGER
    },
    discount_tax_compensation_amount: {
        type: Sequelize.INTEGER
    },
    discount_tax_compensation_invoiced: {
        type: Sequelize.INTEGER
    },
    discount_tax_compensation_refunded: {
        type: Sequelize.INTEGER
    },
    hold_before_state: {
        type: Sequelize.STRING
    },
    hold_before_status: {
        type: Sequelize.STRING
    },
    increment_id: {
        type: Sequelize.STRING
    },
    is_virtual: {
        type: Sequelize.INTEGER
    },
    order_currency_code: {
        type: Sequelize.STRING
    },
    original_increment_id: {
        type: Sequelize.STRING
    },
    oreder_authorization_amount: {
        type: Sequelize.INTEGER
    },
    oreder_auth_expiration: {
        type: Sequelize.INTEGER
    },
    protect_code: {
        type: Sequelize.STRING
    },
    quote_address_id: {
        type: Sequelize.INTEGER
    },
    quote_id: {
        type: Sequelize.INTEGER
    },
    relation_child_id: {
        type: Sequelize.STRING
    },
    relation_child_real_id: {
        type: Sequelize.STRING
    },
    relation_parent_id: {
        type: Sequelize.STRING
    },
    relation_parent_real_id: {
        type: Sequelize.STRING
    },
    remote_ip: {
        type: Sequelize.STRING
    },
    shipping_amount: {
        type: Sequelize.INTEGER
    },
    shipping_canceled: {
        type: Sequelize.INTEGER
    },
    shipping_description: {
        type: Sequelize.STRING
    },
    shipping_discount_amount: {
        type: Sequelize.INTEGER
    },
    shipping_discount_tax_compensation_amount: {
        type: Sequelize.INTEGER
    },
    shipping_incl_tax: {
        type: Sequelize.INTEGER
    },
    shipping_invoiced: {
        type: Sequelize.INTEGER
    },
    shipping_refunded: {
        type: Sequelize.INTEGER
    },
    shipping_tax_amount: {
        type: Sequelize.INTEGER
    },
    shipping_tax_refunded: {
        type: Sequelize.INTEGER
    },
    state: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.STRING
    },
    store_currency_code: {
        type: Sequelize.STRING
    },
    store_id: {
        type: Sequelize.INTEGER
    },
    store_name: {
        type: Sequelize.STRING
    },
    store_to_base_rate: {
        type: Sequelize.INTEGER
    },
    store_to_order_rate: {
        type: Sequelize.INTEGER
    },
    subtotal: {
        type: Sequelize.INTEGER
    },
    subtotal_canceled: {
        type: Sequelize.INTEGER
    },
    subtotal_incl_tax: {
        type: Sequelize.INTEGER
    },
    subtotal_invoiced: {
        type: Sequelize.INTEGER
    },
    subtotal_refunded: {
        type: Sequelize.INTEGER
    },
    tax_amount: {
        type: Sequelize.INTEGER
    },
    tax_canceled: {
        type: Sequelize.INTEGER
    },
    tax_invoiced: {
        type: Sequelize.INTEGER
    },
    tax_refunded: {
        type: Sequelize.INTEGER
    },
    total_canceled: {
        type: Sequelize.INTEGER
    },
    total_due: {
        type: Sequelize.INTEGER
    },
    total_invoiced: {
        type: Sequelize.INTEGER
    },
    total_item_count: {
        type: Sequelize.INTEGER
    },
    total_offline_refunded: {
        type: Sequelize.INTEGER
    },
    total_online_refunded: {
        type: Sequelize.INTEGER
    },
    total_paid: {
        type: Sequelize.INTEGER
    },
    total_qty_ordered: {
        type: Sequelize.INTEGER
    },
    total_refunded: {
        type: Sequelize.INTEGER
    },
    updated_at: {
        type: Sequelize.STRING
    },
    weight: {
        type: Sequelize.INTEGER
    },
    x_forwarded_for: {
        type: Sequelize.STRING
    },
    items: {
        type: Sequelize.JSON
    },
    billing_address: {
        type: Sequelize.JSON
    },
    order: {
        type: Sequelize.JSON
    },
    payment: {
        type: Sequelize.JSON
    },
    status_histories: {
        type: Sequelize.JSON
    },
    extension_attributes: {
        type: Sequelize.JSON
    }
},
    {
        indexes: [
            {
                unique: true,
                fields: ['entity_id']
            }
        ]
    })
Oreder.sync({ alter: true })

/**Cria nova order */
function createOreder(array) {
    try {
        Oreder.create(
            array
        )
    } catch (error) {
        console.log(error)
    }
}

/**Traz Oreder especifico */
async function getOreder(id_) {
    try {
        const oreder = Oreder.findAll({
            where: {
                entity_id: id_
            }
        })
        return oreder
    } catch (error) {
        console.log(error)
    }
}

/**Traz todos os Oreders */
async function getOreders() {
    try {
        const oreder = Oreder.findAll()
        return oreder
    } catch (error) {
        console.log(error)
    }
}

/**Atualiza Oreder especifico */
async function updateOreder(array, id_) {
    try {
        const oreder = await Oreder.update(
            array,
            {
                where: {
                    id: id_
                }
            })
        //return oreder
    } catch (error) {
        console.log(error)
    }
}

/**Deleta Oreder especifico */
async function deleteOreder(id_) {
    try {
        await Oreder.destroy({
            where: {
                id: id_
            }
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports.Oreder = Oreder
module.exports.createOreder = createOreder
module.exports.getOreder = getOreder
module.exports.getOreders = getOreders
module.exports.updateOreder = updateOreder
module.exports.deleteOreder = deleteOreder