const db = require("../../config/db").hardness_db
const eco_db = require("../../config/db").eco_db
const CronJob = require('cron').CronJob

function postProduto(res, obj, img_json = '') {
    if (img_json != '') {
        try {
            bd.query(`INSERT INTO product(
                hrd_D009_Id, 
                product_code, 
                nome, 
                cost_unit, 
                ipv, 
                price_unit, 
                local_quantity, 
                reserved_quantity, 
                actual_quantity,
                categories_id,
                img
            ) VALUES (
                ${obj.hrd_D009_Id}, 
                '${obj.product_code}',
                '${obj.nome}', 
                ${obj.cost_unit}, 
                ${obj.ipv}, 
                ${obj.price_unit}, 
                ${obj.local_quantity}, 
                ${obj.reserved_quantity}, 
                ${obj.actual_quantity},
                ${obj.categ},
                '${img_json}'
            );`)
            getProduto(res, "Produto cadastrado com Sucesso!")
        } catch (err) {
            console.log(err)
            getProduto(res, `Erro ao tentar cadastrar! ERRO: ${err} `)
        }
    } else {
        try {
            bd.query(`INSERT INTO product(
                hrd_D009_Id, 
                product_code, 
                nome, 
                cost_unit, 
                ipv, 
                price_unit, 
                local_quantity, 
                reserved_quantity, 
                actual_quantity,
                categories_id
            ) VALUES (
                ${obj.hrd_D009_Id}, 
                '${obj.product_code}',
                '${obj.nome}', 
                ${obj.cost_unit}, 
                ${obj.ipv}, 
                ${obj.price_unit}, 
                ${obj.local_quantity}, 
                ${obj.reserved_quantity}, 
                ${obj.actual_quantity}, 
                ${obj.categ}
            );`)
            getProduto(res, "Produto cadastrado com Sucesso!")
        } catch (err) {
            console.log(err)
            getProduto(res, `Erro ao tentar cadastrar! ERRO: ${err} `)
        }
    }
}

function putProduto(res, obj, img_json = '') {
    aitvo = 'N'
    if (obj.active) {
        aitvo = 'S'
    }
    if (img_json != '') {
        try {
            eco_db.query(`
            UPDATE product SET 
            hrd_D009_Id='${obj.hrd_D009_Id}', 
            product_code='${obj.product_code}',
            nome='${obj.nome}', 
            cost_unit='${obj.cost_unit}', 
            ipv='${obj.ipv}', 
            price_unit='${obj.price_unit}', 
            local_quantity='${obj.local_quantity}', 
            reserved_quantity='${obj.reserved_quantity}', 
            actual_quantity='${obj.actual_quantity}', 
            active='${aitvo}',            
            categories_id=${obj.categ},
            img ='${img_json}' 
            WHERE  id=${obj.id};`)
            getProduto(res, "Produto atualizado!")

        } catch (err) {
            console.log(err)
            getProduto(res, `Erro ao tentar Atualizar! ERRO: ${err}`)
        }
    } else {
        try {
            eco_db.query(`
            UPDATE product SET 
            hrd_D009_Id='${obj.hrd_D009_Id}', 
            product_code='${obj.product_code}',
            nome='${obj.nome}', 
            cost_unit='${obj.cost_unit}', 
            ipv='${obj.ipv}', 
            price_unit='${obj.price_unit}', 
            local_quantity='${obj.local_quantity}', 
            reserved_quantity='${obj.reserved_quantity}', 
            actual_quantity='${obj.actual_quantity}', 
            active='${aitvo}',  
            categories_id=${obj.categ}
            WHERE  id=${obj.id};`)
            getProduto(res, "Produto atualizado!")

        } catch (err) {
            console.log(err)
            getProduto(res, `Erro ao tentar Atualizar! ERRO: ${err}`)
        }
    }

}

function getProduto(res, msg_ = '') {
    eco_db.query('SELECT * FROM product', function (err, rows, fields) {
        res.render("produtos/produtos", {
            msg: msg_,
            produtos: rows
        })
    })
}

function deleteProduto(id) {
    eco_db.query(`DELETE FROM product where id = ${id}`)
}

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
        GROUP BY D009_Id
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

function atualizaBase(res) {
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
        GROUP BY D009_Id
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
            })
            eco_db.query('SELECT * FROM product', function (err, rows, fields) {
                res.render("produtos/produtos", {
                    msg: "Base de dados Atualizada!",
                    produtos: rows
                })
            })
            
        })
    } catch (err) {
        console.log(err)
    }
}

/** Fim cadastro */

module.exports.postProduto = postProduto
module.exports.putProduto = putProduto
module.exports.getProduto = getProduto
module.exports.deleteProduto = deleteProduto
module.exports.atualizaBase = atualizaBase