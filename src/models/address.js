const Sequelize = require('sequelize');
const db = require("../../config/db").sequelize

/** Cria a tabela caso não exista */
const Address = db.define('api_address', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },address_type: {
        type: Sequelize.STRING(100)
    },
    city: {
        type: Sequelize.STRING
    },
    company: {
        type: Sequelize.STRING(100)
    },
    country_id: {
        type: Sequelize.STRING(10)
    },
    customer_address_id: {
        type: Sequelize.INTEGER
    },
    email: {
        type: Sequelize.STRING(100)
    },
    entity_id: {
        type: Sequelize.INTEGER
    },
    firstname: {
        type: Sequelize.STRING(100)
    },
    lastname: {
        type: Sequelize.STRING(100)
    },
    parent_id: {
        type: Sequelize.INTEGER
    },
    postcode: {
        type: Sequelize.STRING(11)
    },
    region: {
        type: Sequelize.STRING(100)
    },
    region_code: {
        type: Sequelize.STRING(100)
    },
    region_id: {
        type: Sequelize.INTEGER
    },
    street: {
        type: Sequelize.JSON
    },
    telephone: {
        type: Sequelize.STRING(100)
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
                id: id_
            }
        })
        //return address
    } catch (error) {
        console.log(error)
    }
}

/**Deleta address especifico */
async function deleteAddress(id_){
    try{
        await Address.destroy({
            where:{
                id: id_
            }
        })
    }catch(error){
        console.log(error)
    }
}

module.exports.Address = Address
module.exports.createAddress = createAddress
module.exports.getAddress = getAddress
module.exports.getAddresss = getAddresss
module.exports.updateAddress = updateAddress
module.exports.deleteAddress = deleteAddress