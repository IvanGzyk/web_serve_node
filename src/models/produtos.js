const db = require("../../config/db").hardness_db
const eco_db = require("../../config/db").eco_db
const CronJob = require('cron').CronJob

/** Cadastra novos produtos */

const job = new CronJob('0 0 20 * * *', () => { // roda sempre as 20 horas

    try {
        db.query(`SELECT 
            D009_Id hrd_D009_Id,
            D1.D001_Codigo_Produto product_code,
            D2.D002_Descricao_Produto nome,
            D009_Custo(D009_Id, 3) cost_unit,
            1.50 ipv,
            SUM(D009_Custo(D009_Id, 3) * 1.5) price_unit, 
            D009_Quantidade_Estoque_Real local_quantity,
            0 reserved_quantity,
            D009_Quantidade_Estoque_Real actual_quantity
        FROM D009 D9
        INNER JOIN D049 D49 ON D049_Id = D009_D049_Id
        INNER JOIN D001 D1 ON D001_Id = D049_D001_Id
        INNER JOIN D002 D2 ON D002_Id = D001_D002_Id
        WHERE
            D009_C004_Id = 1
            AND D1.D001_C008_Id = 1
            AND D1.D001_Data_Cadastro != '000-00-00'
            AND D009_Custo(D009_Id, 3) > 0
            AND D009_Quantidade_Estoque > 0
        GROUP BY D1.D001_Codigo_Produto
        ORDER BY D009_Quantidade_Estoque DESC
    `, function (err, rows, fields) {
            rows.forEach(element => {
                try {
                    eco_db.query(`INSERT IGNORE INTO product(
                    hrd_D009_Id, 
                    product_code, 
                    nome, 
                    cost_unit, 
                    ipv, 
                    price_unit, 
                    local_quantity, 
                    reserved_quantity, 
                    actual_quantity
                ) VALUES (
                    ${element.hrd_D009_Id}, 
                    '${element.product_code}',
                    '${element.nome}', 
                    ${element.cost_unit}, 
                    ${element.ipv}, 
                    ${element.price_unit}, 
                    ${element.local_quantity}, 
                    ${element.reserved_quantity}, 
                    ${element.actual_quantity}
                );`)
                } catch (err) {
                    console.log(err)
                }
            });
        })
    } catch (err) {
        console.log(err)
    }

}, null, true, 'America/Sao_Paulo')

/** Fim cadastro */