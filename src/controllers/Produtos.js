const ProdutoModel = require('../models/produtos')
const Categorias = require('../integracao/categorias')
const fs = require('fs');
const db_eco = require("../../config/db")
const prod_mag = require("../integracao/produtos")

class Produtos {
    constructor(){

    }
    produtos(application, req, res) {
        ProdutoModel.getProduto(res)
    }
    
    novo(req, res) {
        Categorias.getCategorias()
            .then(dados => dados.data)
            .then(dados => {
                res.render("form/cadastro_produto", { categorias: dados.children_data })
            })
    }
    
    salva_form(req, res) {
        var img_json = ''
        var img_prnci = ''
        var x = 1
        var bd = db_eco.eco_db
        req.files.forEach(element => {
            console.log(element)
            var base64str = this.base64_encode(element.path)
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
                                "Base64EncodedData":"${base64str}",
                                "Type":"${element.mimetype}",
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
                                "Base64EncodedData":"${base64str}",
                                "Type":"${element.mimetype}",
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
        })
        console.log(img_json)
    }
    
    form_atualiza(req, res) {
        Categorias.getCategorias()
            .then(dados => dados.data)
            .then(dados => {
                let params = req.params
                var bd = db_eco.eco_db
                bd.query('SELECT * FROM product where id = ' + params.id, function (err, rows, fields) {
                    res.render("form/atualizar", { produtos: rows, categorias: dados.children_data })
                })
            })
    }
    
    atualiza(req, res) {
        const { promisify } = require('util')
        const unlink = promisify(fs.unlink)
        const obj = JSON.parse(JSON.stringify(req.body))
        var img_json = ''
        var img_prnci = ''
        var aitvo = 'N'
        var x = 1
    
        if (obj.active) {
            aitvo = 'S'
        }
        if (req.files.length != 0) {
    
            req.files.forEach(element => {            
            console.log(element)
                var base64str = this.base64_encode(element.path)
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
                                    "Base64EncodedData":"${base64str}",
                                    "Type":"${element.mimetype}",
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
                                    "Base64EncodedData":"${base64str}",
                                    "Type":"${element.mimetype}",
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
                unlink(element.path)
            })
    
        }
        else {
            ProdutoModel.putProduto(res, obj)
        }
    }
    
    apagar(req, res) {
        let params = req.params
        ProdutoModel.deleteProduto(params.id)
        ProdutoModel.getProduto(res, "Produto Deletado!")
    }
    
    cad_prod_mage(req, res) {
        const bd = db_eco.eco_db
        let id_d009
        let sku
        let name
        let price
        let qty
        let category
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
                        category = element.categories_id
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
                                                        "category_id": "${category}"
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
                                        console.log(data)
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
                        category = element.categories_id
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
                                                        "category_id": "${category}"
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
                                        console.log(data)
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
                                                "category_id": "${category}"
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
                                        console.log(data)
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
                                                "category_id": "${category}"
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
                                console.log(data)
                            })
                        }
                    }
                })
            })
            res.render("produtos/produtos", {
                msg: "Produtos atualzados na Loja!!!",
                produtos: rows
            })
        })
    }
    
    atualiza_base(req, res) {
        ProdutoModel.atualizaBase(res)
    }
    
    base64_encode(file) {
        var bitmap = fs.readFileSync(file)
        return new Buffer(bitmap).toString('base64')
    }
}

module.exports.Produtos = new Produtos()