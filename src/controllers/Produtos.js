const ProdutoModel = require('../models/produtos')
const Categorias = require('../integracao/categorias')
const fs = require('fs');
const db_eco = require("../../config/db")
const prod_mag = require("../integracao/produtos")
const funcoes = require('../util/Util').Util

class Produtos {
    constructor() {

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
            var base64str = this.base64_encode(element.path)
            if (x == 1) {
                img_json = `
                    "media_gallery_entries": [
                        {
                            "id": null,
                            "mediaType":"image",
                            "label":"Foto",
                            "position": ${x},
                            "disabled": false,
                            "types":[
                                "image",
                                "small_image",
                                "thumbnail"
                            ],
                            "content":{
                                "Base64EncodedData":"${base64str}",
                                "Type":"${element.mimetype}",
                                "Name":"${element.originalname}"
                            }
                        }`
            } else {
                img_json += `
                        {
                            "id": null,
                            "mediaType":"image",
                            "label":"Foto${x}",
                            "position": ${x},
                            "disabled": false,
                            "types":[
                                "image",
                                "small_image",
                                "thumbnail"
                            ],
                            "content":{
                                "Base64EncodedData":"${base64str}",
                                "Type":"${element.mimetype}",
                                "Name":"${element.originalname}"
                            }
                        }`
            }
            if (x != req.files.length) {
                img_json += ','
            }
            if (x == req.files.length) {
                img_json += `]`
                const obj = JSON.parse(JSON.stringify(req.body))
                ProdutoModel.postProduto(res, obj, img_json)
            }
            x++
        })
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
                var base64str = this.base64_encode(element.path)
                if (x == 1) {
                    img_json = `
                        "media_gallery_entries": [
                            {
                                "id": null,
                                "mediaType":"image",
                                "label":"Foto",
                                "position": ${x},
                                "disabled": false,
                                "types":[
                                    "image",
                                    "small_image",
                                    "thumbnail"
                                ],
                                "content":{
                                    "Base64EncodedData":"${base64str}",
                                    "Type":"${element.mimetype}",
                                    "Name":"${element.originalname}"
                                }
                            }`
                } else {
                    img_json += `
                            {
                                "id": null,
                                "mediaType":"image",
                                "label":"Foto${x}",
                                "position": ${x},
                                "disabled": false,
                                "types":[
                                    "image",
                                    "small_image",
                                    "thumbnail"
                                ],
                                "content":{
                                    "Base64EncodedData":"${base64str}",
                                    "Type":"${element.mimetype}",
                                    "Name":"${element.originalname}"
                                }
                            }`
                }
                if (x != req.files.length) {
                    img_json += ','
                }
                if (x == req.files.length) {
                    img_json += `]`
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

    atualiza_mage(req, res) {
        const bd = db_eco.eco_db
        let id_d009
        let sku
        let name
        let price
        let qty
        let category
        let img
        let ativo

        bd.query('SELECT * FROM product', function (err, rows, fields) {
            var json
            rows.forEach(element => {
                id_d009 = element.hrd_D009_Id
                sku = element.product_code
                name = element.nome
                price = element.price_unit
                qty = element.actual_quantity
                category = element.categories_id
                ativo = 0
                if (element.active == 'N') {
                    json = `
                        {
                            "product": {
                                "status":${ativo}
                            }
                        }`
                } else {
                    ativo = 1
                    img = element.img
                    json = `
                    {
                        "product":{
                            "sku":"${sku}",
                            "name":"${name}-${sku}-${id_d009}",
                            "price":${price},
                            "status":${ativo},
                            "visibility": 1,
                            "type_id":"simple",
                            "attribute_set_id":4,
                            "extension_attributes":{
                                ${category}
                                "stock_item":{
                                    "qty":${qty},
                                    "is_in_stock":true
                                }
                            },
                            ${img},
                            "custom_attributes": [
                                {
                                    "attribute_code": "description",
                                    "value": "Colocar aqui a descrição do produto..."
                                },
                                {
                                "attribute_code": "id_d009",
                                "value": "${id_d009}"
                                },
                                {
                                    "attribute_code": "fornecedor",
                                    "value": "5"
                                }
                            ]
                        }
                    }`
                    prod_mag.getProduto(element.product_code).then(data => data.data).then(data => data.items).then(data => {
                        if (data.length == 0) {
                            var json_configurable = `{
                                "product": 
                                    {
                                        "sku": "${element.product_code}",
                                        "name": "${name}",
                                        "attribute_set_id": 15,
                                        "status": 1,
                                        "visibility": 4,
                                        "type_id": "configurable",
                                        "weight": "0.5",
                                        "extension_attributes": {
                                            ${category},
                                            "stock_item":{
                                                "qty":${qty},
                                                "is_in_stock":true
                                            }
                                        },
                                        "custom_attributes": [
                                            {
                                                "attribute_code": "description",
                                                "value": "Colocar aqui a descrição do produto..."
                                            },
                                            {
                                                "attribute_code": "id_d009",
                                                "value": "${id_d009}"
                                            }
                                        ]
                                    }
                                }`
                            var options = `{
                                    "sku": "${element.product_code}",
                                        "option": {
                                        "attribute_id": "139",
                                        "label": "fornecedor",
                                        "position": 0,
                                        "is_use_default": true,
                                        "values": [
                                                {
                                                    "value_index": 5
                                                }
                                            ]
                                        }
                                    }`
                            try {
                                prod_mag.postProduto(json_configurable).then(dados => {
                                    prod_mag.ProdutoConfigurableOptions(element.product_code, options)
                                })
                            } catch (error) {
                                console.log(error)
                            }
                        }
                    })
                }
                prod_mag.getProduto(sku).then(data => data.data).then(data => data.items).then(data => {
                    if (data.length != 0) {
                        try {
                            prod_mag.putProduto(sku, json)
                        } catch (error) {
                            console.log("Produto não encontrado!")
                        }
                    } else if (element.active != 'N') {
                        try {
                            prod_mag.postProduto(json).then(data => {
                                let dados = data.data
                                let img = dados.media_gallery_entries
                                var img_local = element.img
                                img_local = img_local.replace('"media_gallery_entries":', '')
                                img_local = JSON.parse(img_local)
                                const img_json = funcoes.salva_id_img(img_local, img)
                                ProdutoModel.putImg(res, element.id, img_json)
                                try {
                                    prod_mag.addProdutoSimple(element.product_code, `{"childSku": "${sku}"}`)
                                } catch (err) {
                                    console.log(err)
                                }
                            })
                        } catch (error) {
                            console.log("Produto não encontrado!")
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

    cad_prod_unic(req, res) {
        const bd = db_eco.eco_db
        let id_d009
        let sku
        let name
        let price
        let qty
        let category
        let img
        let ativo
        let params = req.params
        let attribute_id
        let atributo
        var json
        var jsonAtribute
        var value_index
        var atribFornece = false
        var fornecedor
        var options

        bd.query('SELECT * FROM product WHERE hrd_D009_Id = "' + params.D009_Id + '"', function (err, rows, fields) {

            rows.forEach(element => {
                let para = {
                    $or: [{ "attribute_code": "fornecedor" }],
                    $perPage: 200,
                    $page: 1
                }
                prod_mag.GetProdutosAtributos(para).then(data => data.data).then(item => {

                    atributo = item.items
                    fornecedor = element.fornecedor.split(" ")
                    atributo.forEach(element => {
                        attribute_id = element.attribute_id
                        options = element.options
                        options.forEach(opt => {
                            if (opt.label == fornecedor[0]) {
                                value_index = opt.value
                                atribFornece = true
                            }
                        });
                    })
                    console.log(value_index)
                    if (atribFornece == false) {
                        jsonAtribute = `{
                            "attribute":{
                                "position":0,
                                "used_in_product_listing":"true",
                                "attribute_id":${attribute_id},
                                "options":[
                                    {
                                        "label":"${fornecedor[0]}"
                                    }
                                ]
                            }
                        }`
                        prod_mag.putProdutosAtributos(attribute_id, jsonAtribute).then(dados => {
                            console.log(dados)
                        })
                    }
                })

                prod_mag.GetProdutosAtributos(para).then(data => data.data).then(item => {
                    atributo = item.items
                    fornecedor = element.fornecedor.split(" ")
                    atributo.forEach(element => {
                        attribute_id = element.attribute_id
                        options = element.options
                        options.forEach(opt => {
                            if (opt.label == fornecedor[0]) {
                                value_index = opt.value
                            }
                        });
                    })
                    console.log(attribute_id)
                    console.log(value_index)

                    id_d009 = element.hrd_D009_Id
                    sku = element.product_code + '-' + element.hrd_D009_Id
                    name = element.nome
                    price = element.price_unit
                    qty = element.actual_quantity
                    category = element.categories_id
                    ativo = 0
                    if (element.active == 'N') {
                        json = `
                        {
                            "product": {
                                "status":${ativo}
                            }
                        }`
                    } else {
                        ativo = 1
                        img = element.img
                        json = `
                        {
                            "product":{
                                "sku":"${sku}",
                                "name":"${name}-${sku}",
                                "attribute_set_id":15,
                                "price":${price},
                                "status":${ativo},
                                "visibility": 1,
                                "type_id":"simple",
                                "extension_attributes":{
                                    ${category},
                                    "stock_item":{
                                        "qty":${qty},
                                        "is_in_stock":true
                                    }
                                },
                                ${img},
                                "custom_attributes": [
                                    {
                                        "attribute_code": "description",
                                        "value": "Colocar aqui a descrição do produto..."
                                    },
                                    {
                                        "attribute_code": "id_d009",
                                        "value": "${id_d009}"
                                    },
                                    {
                                        "attribute_code": "fornecedor",
                                        "value": "${value_index}"
                                    }
                                ]
                            }
                        }`
                    }
                    prod_mag.getProduto(element.product_code).then(data => data.data).then(data => data.items).then(data => {
                        if (data.length == 0) {
                            var json_configurable = `{
                            "product": 
                                {
                                    "sku": "${element.product_code}",
                                    "name": "${name}",
                                    "attribute_set_id": 15,
                                    "status": 1,
                                    "visibility": 4,
                                    "type_id": "configurable",
                                    "weight": "0.5",
                                    "extension_attributes": {
                                        ${category},
                                        "stock_item":{
                                            "qty":${qty},
                                            "is_in_stock":true
                                        }
                                    },
                                    "custom_attributes": [
                                        {
                                            "attribute_code": "description",
                                            "value": "Colocar aqui a descrição do produto..."
                                        },
                                        {
                                            "attribute_code": "id_d009",
                                            "value": "${id_d009}"
                                        }
                                    ]
                                }
                            }`
                            var options = `{
                                "sku": "${element.product_code}",
                                    "option": {
                                    "attribute_id": "${attribute_id}",
                                    "label": "fornecedor",
                                    "position": 0,
                                    "is_use_default": true,
                                    "values": [
                                            {
                                                "value_index": ${value_index}
                                            }
                                        ]
                                    }
                                }`
                            try {
                                prod_mag.postProduto(json_configurable).then(dados => {
                                    prod_mag.ProdutoConfigurableOptions(element.product_code, options)
                                })
                            } catch (error) {
                                console.log(error)
                            }
                        }
                    })
                    prod_mag.getProduto(sku).then(data => data.data).then(data => data.items).then(data => {
                        if (data.length != 0) {
                            try {
                                prod_mag.putProduto(sku, json).then(data => {
                                    let dados = data.data
                                    let img = dados.media_gallery_entries
                                    var img_local = element.img
                                    img_local = img_local.replace('"media_gallery_entries":', '')
                                    img_local = JSON.parse(img_local)
                                    const img_json = funcoes.salva_id_img(img_local, img)
                                    ProdutoModel.putImg(res, element.id, img_json)
                                    try {
                                        prod_mag.addProdutoSimple(element.product_code, `{"childSku": "${sku}"}`)
                                    } catch (err) {
                                        console.log(err)
                                    }
                                })
                            } catch (error) {
                                console.log("Produto não encontrado!")
                            }
                        } else if (element.active != 'N') {
                            try {
                                prod_mag.postProduto(json).then(data => {
                                    let dados = data.data
                                    let img = dados.media_gallery_entries
                                    var img_local = element.img
                                    img_local = img_local.replace('"media_gallery_entries":', '')
                                    img_local = JSON.parse(img_local)
                                    const img_json = funcoes.salva_id_img(img_local, img)
                                    ProdutoModel.putImg(res, element.id, img_json)
                                    try {
                                        prod_mag.addProdutoSimple(element.product_code, `{"childSku": "${sku}"}`)
                                    } catch (err) {
                                        console.log(err)
                                    }
                                })
                            } catch (error) {
                                console.log("Produto não encontrado!")
                            }
                        }
                    })
                })

            })
            bd.query('SELECT * FROM product', function (err, rows, fields) {
                res.render("produtos/produtos", {
                    msg: "Produto atualzado na Loja!!!",
                    produtos: rows
                })
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