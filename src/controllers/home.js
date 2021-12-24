const ProdutoModel = require('../models/produtos')

module.exports.home = function (application, req, res) {
    const db_eco = require("../../config/db")
    bd = db_eco.eco_db
    ProdutoModel.getProduto(res)
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
                const obj = JSON.parse(JSON.stringify(req.body))
                ProdutoModel.postProduto(res, obj, img_json)
            }
            x++
        }).catch((error) => { console.log(error) })
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
    const fs = require('fs')
    const { promisify } = require('util')
    const unlink = promisify(fs.unlink)
    const obj = JSON.parse(JSON.stringify(req.body))
    const db_eco = require("../../config/db")
    bd = db_eco.eco_db
    const imageToBase64 = require('image-to-base64')
    img_json = ''
    img_prnci = ''
    aitvo = 'N'
    x = 1

    if (obj.active) {
        aitvo = 'S'
    }
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
                    ProdutoModel.putProduto(res, obj, img_json)
                }
                x++
            }).catch((error) => { console.log(error) })
            unlink(element.path)
        })

    }
    else {
        ProdutoModel.putProduto(res, obj)
    }
}

module.exports.apagar = function (req, res) {
    let params = req.params
    ProdutoModel.deleteProduto(params.id)
    ProdutoModel.getProduto(res, "Produto Deletado!")
}

module.exports.cad_prod_mage = function (req, res) {
    const bd = require("../../config/db").eco_db
    const prod_mag = require("../integracao/produtos")

    let id_d009
    let sku
    let name
    let price
    let qty
    let ativo
    let img

    bd.query('SELECT * FROM product', function (err, rows, fields) {
        var json
        prod_mag.getProdutos().then(data => data.data).then(data => data.items).then(data => {

            rows.forEach(element => {
                if (element.active == 'N') {
                    id_d009 = element.hrd_D009_Id
                    sku = element.product_code
                    name = element.nome
                    price = element.price_unit
                    qty = element.actual_quantity
                    ativo = 0
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
                                        "custom_attributes": [{
                                            "attribute_code": "id_d009",
                                            "value": "${id_d009}"
                                        }]
                                    }
                                }`
                                prod_mag.putProduto(sku, json).then(data => {
                                    //console.log(data)
                                    //console.log(data.config)
                                })
                            }
                        })
                    }

                } else if (element.active == 'S') {
                    id_d009 = element.hrd_D009_Id
                    sku = element.product_code
                    name = element.nome
                    price = element.price_unit
                    qty = element.actual_quantity
                    ativo = 1
                    img = element.img

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
                                prod_mag.putProduto(sku, json).then(data => {
                                    //console.log(data)
                                    //console.log(data.config)
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
                                prod_mag.postProduto(json).then(data => {
                                    //console.log(data.status)
                                    //console.log(data.config)
                                })
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
                        prod_mag.postProduto(json).then(data => {
                            //console.log(data.status)
                            //console.log(data.config)
                        })
                    }
                }
            })
        })
        res.render("home/home", {
            msg: "Produtos atualzados na Loja!!!",
            produtos: rows
        })
    })
}

module.exports.atualiza_base = function (req, res){
    ProdutoModel.atualizaBase(res)
}