module.exports.home = function (application, req, res) {
    const db_eco = require("../../config/db")
    bd = db_eco.eco_db
    bd.query('SELECT * FROM product', function (err, rows, fields) {
        res.render("home/home", {
            msg: "",
            produtos: rows
        })
    })
}

module.exports.testePost = function (req, res) {
    const obj = JSON.parse(JSON.stringify(req.body))
    res.render("home/teste", { teste: obj })
}

module.exports.novo = function (req, res) {
    res.render("form/cadastro_produto")
}

module.exports.salva_form = function (req, res) {
    const db_eco = require("../../config/db")
    bd = db_eco.eco_db
    const imageToBase64 = require('image-to-base64')
    img_json = ''
    img_prnci = ''
    x = 1
    req.files.forEach(element => {
        imageToBase64(element.path).then((response) => {
            if (x == 1) {
                img_json = `
                "media_gallery_entries": [
                    {
                        "mediaType":"image",
                        "label":"Foto",
                        "position": ${x},
                        "disabled": false,
                        "types":[
                            "image",
                            "small_image",
                            "thumbnail"
                        ],
                        "file":null,
                        "content":{
                            "Base64EncodedData":"${response}",
                            "Type":"image/jpeg",
                            "Name":"${element.originalname}"
                        }
                    }
                ],
                "media_gallery_entries": [`
            } else {
                img_json += `
                    {
                        "mediaType":"image",
                        "label":"Foto${x}",
                        "position": ${x},
                        "disabled": false,
                        "types":[
                            "image",
                            "small_image",
                            "thumbnail"
                        ],
                        "file":null,
                        "content":{
                            "Base64EncodedData":"${response}",
                            "Type":"image/jpeg",
                            "Name":"${element.originalname}"
                        }
                    }`
                if (x != req.files.length) {
                    img_json += ','
                }
            }
            if (x == req.files.length) {
                img_json += `],`
                //console.log(img_json)
                const obj = JSON.parse(JSON.stringify(req.body))
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
                '${img_json}'
            );`)
                bd.query('SELECT * FROM product', function (err, rows, fields) {
                    res.render("home/home", {
                        msg: "Produto cadastrado com Sucesso!",
                        produtos: rows
                    })
                })
            }
            x++
        }).catch((error) => { console.log(error) })
        //console.log(img_json)
    })
    console.log(img_json)
}

module.exports.form_atualiza = function (req, res) {
    let params = req.params
    const db_eco = require("../../config/db")
    bd = db_eco.eco_db
    bd.query('SELECT * FROM product where id = ' + params.id, function (err, rows, fields) {
        res.render("form/atualizar", { produtos: rows })
    })
}

module.exports.atualiza = function (req, res) {
    console.log(req.files.length)
    const obj = JSON.parse(JSON.stringify(req.body))
    const db_eco = require("../../config/db")
    bd = db_eco.eco_db
    const imageToBase64 = require('image-to-base64')
    img_json = ''
    img_prnci = ''
    x = 1
    if (req.files.length != 0) {
        req.files.forEach(element => {
            imageToBase64(element.path).then((response) => {
                if (x == 1) {
                    img_json = `
                "media_gallery_entries": [
                    {
                        "mediaType":"image",
                        "label":"Foto",
                        "position": ${x},
                        "disabled": false,
                        "types":[
                            "image",
                            "small_image",
                            "thumbnail"
                        ],
                        "file":null,
                        "content":{
                            "Base64EncodedData":"${response}",
                            "Type":"image/jpeg",
                            "Name":"${element.originalname}"
                        }
                    }
                ],
                "media_gallery_entries": [`
                } else {
                    img_json += `
                    {
                        "mediaType":"image",
                        "label":"Foto${x}",
                        "position": ${x},
                        "disabled": false,
                        "types":[
                            "image",
                            "small_image",
                            "thumbnail"
                        ],
                        "file":null,
                        "content":{
                            "Base64EncodedData":"${response}",
                            "Type":"image/jpeg",
                            "Name":"${element.originalname}"
                        }
                    }`
                    if (x != req.files.length) {
                        img_json += ','
                    }
                }
                if (x == req.files.length) {
                    img_json += `],`
                    //console.log(img_json)
                    const sql = `
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
                active='${obj.active}',
                img ='${img_json}' 
                WHERE  id=${obj.id};`

                    bd.query(sql)

                    bd.query('SELECT * FROM product', function (err, rows, fields) {
                        res.render("home/home", {
                            msg: "",
                            produtos: rows
                        })
                    })
                }
                x++
            }).catch((error) => { console.log(error) })
        })
    } else {
        const sql = `
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
            active='${obj.active}' 
            WHERE  id=${obj.id};`

        bd.query(sql)

        bd.query('SELECT * FROM product', function (err, rows, fields) {
            res.render("home/home", {
                msg: "",
                produtos: rows
            })
        })
    }
}

module.exports.apagar = function (req, res) {
    let params = req.params
    const db_eco = require("../../config/db")
    bd = db_eco.eco_db
    bd.query(`DELETE FROM product where id = ${params.id}`)

    bd.query('SELECT * FROM product', function (err, rows, fields) {
        res.render("home/home", {
            msg: "",
            produtos: rows
        })
    })
}

module.exports.cad_prod_mage = function (req, res) {
    const db_eco = require("../../config/db")
    const prod_mag = require("../integracao/produtos")
    bd = db_eco.eco_db

    let id_d009
    let sku
    let name
    let price
    let qty
    let ativo
    let img

    bd.query('SELECT * FROM product', function (err, rows, fields) {
        let encontrou = false
        var json
        prod_mag.getProdutos().then(data => data.data).then(data => data.items).then(data => {

            rows.forEach(element => {
                encontrou = false
                if (element.active == 'N') {
                    id_d009 = element.hrd_D009_Id
                    sku = element.product_code
                    name = element.nome
                    price = element.price_unit
                    qty = element.actual_quantity
                    ativo = 0
                    img = element.img

                } else {
                    id_d009 = element.hrd_D009_Id
                    sku = element.product_code
                    name = element.nome
                    price = element.price_unit
                    qty = element.actual_quantity
                    ativo = 1
                    img = element.img
                }
                if (data.length != 0) {
                    data.forEach(cod_prod => {
                        if (cod_prod.sku == element.product_code) {
                            json = `
                            {
                            "product":{
                                "sku":"${sku}",
                                "name":"${name}",
                                "price":${price},
                                "status":${ativo},
                                "type_id":"simple",
                                "attribute_set_id":4,
                                "weight":1,
                                "extension_attributes":{
                                    "category_links": [
                                        {
                                            "position": 0,
                                            "category_id": "5"
                                        }
                                    ],
                                    "stock_item":{
                                        "qty":${qty},
                                        "is_in_stock":true
                                    }
                                },
                                ${img}
                                "custom_attributes": [{
                                    "attribute_code": "id_d009",
                                    "value": "${id_d009}"
                                }]
                            }
                        }`
                            encontrou = true
                        } else {
                            json = `
                            {
                                "product":{
                                    "sku":"${sku}",
                                    "name":"${name}",
                                    "price":${price},
                                    "status":${ativo},
                                    "type_id":"simple",
                                    "attribute_set_id":4,
                                    "weight":1,
                                    "extension_attributes":{
                                        "category_links": [
                                            {
                                                "position": 0,
                                                "category_id": "5"
                                            }
                                        ],
                                        "stock_item":{
                                            "qty":${qty},
                                            "is_in_stock":true
                                        }
                                    },
                                    ${img}
                                    "custom_attributes": [{
                                        "attribute_code": "id_d009",
                                        "value": "${id_d009}"
                                    }]
                                }
                            }`
                        }
                    })
                } else {
                    json = `
                    {
                        "product":{
                            "sku":"${sku}",
                            "name":"${name}",
                            "price":${price},
                            "status":${ativo},
                            "type_id":"simple",
                            "attribute_set_id":4,
                            "weight":1,
                            "extension_attributes":{
                                "category_links": [
                                    {
                                        "position": 0,
                                        "category_id": "5"
                                    }
                                ],
                                "stock_item":{
                                    "qty":${qty},
                                    "is_in_stock":true
                                }
                            },
                            ${img}
                            "custom_attributes": [{
                                "attribute_code": "id_d009",
                                "value": "${id_d009}"
                            }]
                        }
                    }`
                }
                if (encontrou == true) {
                    console.log(sku)
                    console.log(json)
                    prod_mag.putProduto(sku, json).then(data => {
                        //console.log(data.status)
                        //console.log(data.config)
                    })
                } else {
                    console.log(json)
                    prod_mag.postProduto(json).then(data => {
                        //console.log(data.status)
                        //console.log(data.config)
                    })
                }
            })
        })
        res.render("home/home", {
            msg: "Produtos atualzados com sucesso!!!",
            produtos: rows
        })
    })
}
