const mage = require("../../config/conexao_mage")

const client = mage.client

const getCategorias = async function () {
    try {
        let dados = await client.get('categories')
        return dados
    } catch (err) {
        console.log(err)
    }
}
module.exports = { client, getCategorias}