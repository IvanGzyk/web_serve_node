const db = require("../../config/db").hardness_db
const eco_db = require("../../config/db").eco_db
const prod_mag = require("../integracao/produtos")
const CronJob = require('cron').CronJob

function postProduto(res, obj, img_json = '', img_princi = '') {
    console.log(img_json)
    cat = obj.categ
    cate = ''
    x = 1
    if (cat.length > 1) {

        cat.forEach(categoria => {
            if (x == 1) {
                cate = `
                "category_links": [
                    {
                        "position": 0,
                        "category_id": "${categoria}"
                    },`
            } else {
                p = x - 1
                cate += `'
                    {
                        "position": ${p},
                        "category_id": "${categoria}"
                    }`
                if (x != cat.length) {
                    cate += ','
                }
            }
            if (x == cat.length) {
                cate += `
                ]`
            }
            x++
        })

    } else {
        cate = `
            "category_links": [
                {
                    "position": 0,
                    "category_id": "${cat}"
                }
            ]`
    }
    if (img_json != '') {
        try {
            eco_db.query(`INSERT INTO product(
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
                img,
                img_configuravel
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
                ${cate},
                '${img_json}',
                '${img_princi}'
            );`)
            getProduto(res, "Produto cadastrado com Sucesso!")
        } catch (err) {
            console.log(`/models/products/ postProduto() ${err}`)
            getProduto(res, `Erro ao tentar cadastrar! ERRO: ${err} `)
        }
    } else {
        try {
            eco_db.query(`INSERT INTO product(
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
                ${cate}
            );`)
            getProduto(res, "Produto cadastrado com Sucesso!")
        } catch (err) {
            console.log(`/models/products/ postProduto() ${err}`)
            getProduto(res, `Erro ao tentar cadastrar! ERRO: ${err} `)
        }
    }
}

function putProduto(res, obj, img_json = '', img_princi = '') {
    var cat = obj.categ
    var cate = ''
    x = 1
    if (cat.length > 1) {

        cat.forEach(categoria => {
            if (x == 1) {
                cate = `
                "category_links": [
                    {
                        "position": 0,
                        "category_id": "${categoria}"
                    },`
            } else {
                p = x - 1
                cate += `
                    {
                        "position": ${p},
                        "category_id": "${categoria}"
                    }`
                if (x != cat.length) {
                    cate += ','
                }
            }
            if (x == cat.length) {
                cate += `
                ]`
            }
            x++
        })

    } else {
        cate = `
            "category_links": [
                {
                    "position": 0,
                    "category_id": "${cat}"
                }
            ]`
    }
    var ativo = 'N'
    var msg = ''
    if (obj.active) {
        eco_db.query(`SELECT active FROM product WHERE product_code = "${obj.product_code}" AND D024Id = "${obj.D024Id}" AND hrd_D009_Id != "${obj.hrd_D009_Id}"`, function (err, rows, fields) {

            if (rows.length > 0) {
                rows.forEach(element => {
                    if (element.active == 'S') {
                        msg = 'O sistema não permite ativar dois produtos iguais!'
                    } else {
                        ativo = 'S'
                        msg = 'Produto atualizado!'
                    }
                })
            } else {
                ativo = 'S'
                msg = 'Produto atualizado!'
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
                    active='${ativo}',
                    categories_id='${cate}',
                    img = '${img_json}',
                    img_configuravel = '${img_princi}'
                    WHERE  id=${obj.id};`)
                    getProduto(res, msg)

                } catch (err) {
                    console.log(`/models/products/ putProduto() ${err}`)
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
                    active='${ativo}',
                    categories_id='${cate}'
                    WHERE  id=${obj.id};`)
                    getProduto(res, msg)

                } catch (err) {
                    console.log(`/models/products/ putProduto() ${err}`)
                    getProduto(res, `Erro ao tentar Atualizar! ERRO: ${err}`)
                }
            }
        })
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
            active='${ativo}',
            categories_id='${cate}'
            WHERE  id=${obj.id};`)
            getProduto(res, msg)

        } catch (err) {
            console.log(`/models/products/ putProduto() ${err}`)
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

function atualizaValorProdLoja(price, id) {

    eco_db.query(`
    UPDATE product SET
    price_loja = '${price}'
    WHERE  id=${id};`)
}

function deleteProduto(id) {
    eco_db.query(`DELETE FROM product where id = ${id}`)
}

function putImg(id, img) {
    try {
        eco_db.query(`
    UPDATE product SET
    img = '${img}'
    WHERE  id=${id};`)
    } catch (err) {
        console.log(`/models/products/ putImg() ${err}`)
    }

}

/** Cadastra novos produtos */

const job = new CronJob('0 0 20 * * *', () => { // roda sempre as 20 horas

    /** Alterar D009_C004_Id de 1 para 16 quando for para produção */
    try {
        db.query(`SELECT
        D009_Id hrd_D009_Id,
        D49.D049_Id,
        D24.D024_Id,
        D1.D001_Codigo_Produto product_code,
        D2.D002_Descricao_Produto nome,
        CONCAT( D24.D024_Nome_Empresa,' - ', IFNULL(D24_B.D024_Nome_Empresa,'')) AS fornecedor,
        D1.D001_Peso_Unitario_Kg peso_uni_kg,
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
     INNER JOIN D024 D24 ON D024_Id = D049_D024_Id
     LEFT JOIN D024 D24_B ON D24_B.D024_Id = D049_Trade_Id
     WHERE
        D009_C004_Id = 1
        AND D1.D001_C008_Id = 1
        AND D1.D001_Data_Cadastro != '0000-00-00'
        AND D009_Custo(D009_Id, 3) > 0
        AND D009_Quantidade_Estoque > 0
         AND D49.D049_Flag_Ativo = 'S'
        AND D24.D024_Data_Irregular = '0000-00-00'
     GROUP BY D009_Id
     ORDER BY D009_Quantidade_Estoque DESC
        `, function (err, rows, fields) {
            rows.forEach(element => {
                try {
                    eco_db.query(`INSERT IGNORE INTO product(
                    hrd_D009_Id,
                    product_code,
                    D049Id,
                    D024Id,
                    nome,
                    fornecedor,
                    peso_uni_kg,
                    cost_unit,
                    ipv,
                    price_unit,
                    local_quantity,
                    reserved_quantity,
                    actual_quantity
                ) VALUES (
                    ${element.hrd_D009_Id},
                    '${element.product_code}',
                    '${element.D049_Id}',
                    '${element.D024_Id}',
                    '${element.nome}',
                    '${element.fornecedor}',
                    '${element.peso_uni_kg}',
                    ${element.cost_unit},
                    ${element.ipv},
                    ${element.price_unit},
                    ${element.local_quantity},
                    ${element.reserved_quantity},
                    ${element.actual_quantity}
                );`)
                } catch (err) {
                    console.log(err.response.data.message)
                }
            });
        })
    } catch (err) {
        console.log(err.response.data.message)
    }

}, null, true, 'America/Sao_Paulo')

/** Alterar D009_C004_Id de 1 para 16 quando for para produção */
function atualizaBase(res) {
    try {
        db.query(`SELECT
        D009_Id hrd_D009_Id,
        D49.D049_Id,
        D24.D024_Id,
        D1.D001_Codigo_Produto product_code,
        D2.D002_Descricao_Produto nome,
        CONCAT( D24.D024_Nome_Empresa,' - ', IFNULL(D24_B.D024_Nome_Empresa,'')) AS fornecedor,
        D1.D001_Peso_Unitario_Kg peso_uni_kg,
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
     INNER JOIN D024 D24 ON D024_Id = D049_D024_Id
     LEFT JOIN D024 D24_B ON D24_B.D024_Id = D049_Trade_Id
     WHERE
        D009_C004_Id = 1
        AND D1.D001_C008_Id = 1
        AND D1.D001_Data_Cadastro != '0000-00-00'
        AND D009_Custo(D009_Id, 3) > 0
        AND D009_Quantidade_Estoque > 0
         AND D49.D049_Flag_Ativo = 'S'
        AND D24.D024_Data_Irregular = '0000-00-00'
     GROUP BY D009_Id
     ORDER BY D009_Quantidade_Estoque DESC
        `, function (err, rows, fields) {
            rows.forEach(element => {
                try {
                    eco_db.query(`INSERT IGNORE INTO product(
                    hrd_D009_Id,
                    product_code,
                    D049Id,
                    D024Id,
                    nome,
                    fornecedor,
                    peso_uni_kg,
                    cost_unit,
                    ipv,
                    price_unit,
                    local_quantity,
                    reserved_quantity,
                    actual_quantity
                ) VALUES (
                    ${element.hrd_D009_Id},
                    '${element.product_code}',
                    '${element.D049_Id}',
                    '${element.D024_Id}',
                    '${element.nome}',
                    '${element.fornecedor}',
                    '${element.peso_uni_kg}',
                    ${element.cost_unit},
                    ${element.ipv},
                    ${element.price_unit},
                    ${element.local_quantity},
                    ${element.reserved_quantity},
                    ${element.actual_quantity}
                );`)
                } catch (err) {
                    console.log(err.response.data.message)
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
        console.log(err.response.data.message)
    }
}

/** Fim cadastro */

module.exports.postProduto = postProduto
module.exports.putProduto = putProduto
module.exports.getProduto = getProduto
module.exports.deleteProduto = deleteProduto
module.exports.atualizaBase = atualizaBase
module.exports.putImg = putImg
module.exports.atualizaValorProdLoja = atualizaValorProdLoja