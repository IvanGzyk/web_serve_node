const ProdutoModel = require('../models/produtos')
const Categorias = require('../integracao/categorias')
const fs = require('fs');
const db_eco = require("../../config/db")
const prod_mag = require("../integracao/produtos")
const funcoes = require('../util/Util').Util
const { exit } = require('process')

const bd = db_eco.eco_db
let id_d001
let id_d009
let id_d049
let sku
let name
let price
let qty
let category
let img
let img_configuravel
let ativo
let attribute_id
let atributo
var json
var jsonAtribute
let value_index
var atribFornece = false
var fornecedor
var trade
var options


async function atributos(para) {
    atrib = await prod_mag.GetProdutosAtributos(para)
    return funcoes.atributo(atrib)
}

async function cadastraAtributo(attribute_id, fornecedor) {
    jsonAtribute = {
        "attribute": {
            "position": 0,
            "used_in_product_listing": "true",
            "attribute_id": attribute_id,
            "options": [
                {
                    "label": "${fornecedor}"
                }
            ]
        }
    }
    await prod_mag.putProdutosAtributos(attribute_id, jsonAtribute)
}

async function pegaProduto(sku) {
    dados = await prod_mag.getProduto(sku)
    return funcoes.pegaProduto(dados)
}

async function cadastraProduto(params) {
    //console.log(params)
    dados = await prod_mag.postProduto(params)
    return funcoes.retornaData(dados)
}

async function cadastraProdutoConfiguravel(sku, option) {
    //console.log(sku +' - '+option)
    if (option != undefined) {
        dados = await prod_mag.ProdutoConfigurableOptions(sku, option)
    }
}

async function atualizaProduto(sku, params) {
    dados = await prod_mag.putProduto(sku, params)
    return funcoes.retornaData(dados)
}

async function viculaProduto(sku, params) {
    //console.log(sku+' - '+ params)
    dados = await prod_mag.addProdutoSimple(sku, params)//.then(console.log)
}

async function main7(element, sku) {
    //console.log(`{"childSku": "${sku}"}`)
    await viculaProduto(element.product_code, `{"childSku": "${sku}"}`)
}

async function main6(items, element, json, sku) {
    if (items.length != 0) {
        try {
            await atualizaProduto(sku, json).then(data => {

                let dados = data.data
                let img = dados.media_gallery_entries
                var img_local = element.img
                img_local = img_local.replace('"media_gallery_entries":', '')
                img_local = JSON.parse(img_local)
                const img_json = funcoes.salva_id_img(img_local, img)
                ProdutoModel.putImg(element.id, img_json)
                main7(element, sku)
                ProdutoModel.atualizaValorProdLoja(dados.price, element.id)
            })
        } catch (error) {
            console.log("Produto não encontrado! " + error)
        }
    } else if (element.active != 'N') {
        try {
            await cadastraProduto(json).then(data => {
                let dados = data.data
                let img = dados.media_gallery_entries
                var img_local = element.img
                img_local = img_local.replace('"media_gallery_entries":', '')
                img_local = JSON.parse(img_local)
                const img_json = funcoes.salva_id_img(img_local, img)
                ProdutoModel.putImg(element.id, img_json)
                main7(element, sku)
                ProdutoModel.atualizaValorProdLoja(dados.price, element.id)
            })
        } catch (error) {
            console.log("Produto não encontrado!")
        }
    }
}

async function main5(element, json, sku) {
    await pegaProduto(element.product_code).then(items => {
        main6(items, element, json, sku)
    })
}

async function main4(element, options, json, sku) {
    //console.log(element.product_code+" - "+options)
    await cadastraProdutoConfiguravel(element.product_code, options)
    main5(element, json, sku)
}

async function main3(json_configurable, element, options, json, sku) {

    if (json_configurable != undefined) {
        try {
            await cadastraProduto(json_configurable).then(dados => {
                main4(element, options, json, sku)
            })
        } catch (error) {
            console.log(error)
        }
    } else {
        main4(element, options, json, sku)
    }
}

async function main2(element, name, id_d009, category, qty, img_configuravel, attribute_id, value_index, json, sku) {

    await pegaProduto(element.product_code).then(data => {
        var json_configurable
        var options
        if (data.length == 0) {
            json_configurable = `{
            "product":
                {
                    "sku": "${element.product_code}",
                    "name": "${name}-${id_d009}",
                    "attribute_set_id": 31,
                    "status": 1,
                    "visibility": 4,
                    "type_id": "configurable",
                    "extension_attributes": {
                        ${category},
                        "stock_item":{
                            "qty":${qty},
                            "is_in_stock":true
                        }
                    },
                    ${img_configuravel},
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
            options = `{
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
        }
        main3(json_configurable, element, options, json, sku)
    })
}

async function main(element) {
    let para = {
        $or: [{ "attribute_code": "fornecedor" }],
        $perPage: 200,
        $page: 1
    }
    await atributos(para).then(atrib => {
        //console.log(atrib)
        var forn = element.fornecedor.split(" - ")
        fornecedor = forn[0].split(" ")
        fornecedor = fornecedor[0]
        if (forn.length == 2) {
            trade = forn[1].split(" ")
            fornecedor = fornecedor + ' ' + trade[0]
        }

        attribute_id = atrib.attribute_id
        options = atrib.options
        options.forEach(opt => {
            if (opt.label == fornecedor) {
                atribFornece = true
            }
        })
        if (atribFornece == false) {
            cadastraAtributo(attribute_id, fornecedor)
        }
    })

    await atributos(para).then(atrib => {
        var forn = element.fornecedor.split(" - ")
        fornecedor = forn[0].split(" ")
        fornecedor = fornecedor[0]
        if (forn.length == 2) {
            trade = forn[1].split(" ")
            fornecedor = fornecedor + ' ' + trade[0]
        }
        attribute_id = atrib.attribute_id
        options = atrib.options
        options.forEach(opt => {
            if (opt.label == fornecedor) {
                value_index = opt.value
            }
        })

        id_d001 = element.product_code
        id_d009 = element.hrd_D009_Id
        id_d049 = element.D049Id
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
            img_configuravel = element.img_configuravel
            json = `
            {
                "product":{
                    "sku":"${sku}",
                    "name":"${name}-${sku}",
                    "attribute_set_id": 31,
                    "price":${price},
                    "status":${ativo},
                    "visibility": 1,
                    "type_id":"simple",
                    "weight": "${element.peso_uni_kg}",
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
                            "attribute_code": "d001_id",
                            "value": "${id_d001}"
                        },
                        {
                            "attribute_code": "d049_id",
                            "value": "${id_d049}"
                        },
                        {
                            "attribute_code": "fornecedor",
                            "value": "${value_index}"
                        }
                    ]
                }
            }`
        }
        //console.log(json)
        main2(element, name, id_d009, category, qty, img_configuravel, attribute_id, value_index, json, sku)
    })
}

const produtos = async function (application, req, res) {
    ProdutoModel.getProduto(res)
}

const novo = async function (req, res) {
    Categorias.getCategorias()
        .then(dados => dados.data)
        .then(dados => {
            res.render("form/cadastro_produto", { categorias: dados.children_data })
        })
}

const salva_form = async function (req, res) {
    var img_json = ''
    var img_princi = ''
    var x = 1
    var bd = db_eco.eco_db
    req.files.forEach(element => {
        console.log(element.path)
        var base64str = this.base64_encode(element.path)
        if (x == 1) {
            img_princi = `
                    "media_gallery_entries": [{
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
                    }]`

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
            ProdutoModel.postProduto(res, obj, img_json, img_princi)
        }
        x++
    })
}

const form_atualiza = async function (req, res) {
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

const atualiza = async function (req, res) {
    const { promisify } = require('util')
    const unlink = promisify(fs.unlink)
    const obj = JSON.parse(JSON.stringify(req.body))
    var img_json = ''
    var img_princi = ''
    var aitvo = 'N'
    var x = 1

    if (obj.active) {
        aitvo = 'S'
    }
    const imagems = JSON.parse(JSON.stringify(req.files))
    if (!imagems) {
        imagems.imagem.forEach(element => {
            var base64str = this.base64_encode(element.path)
            img_princi = `
                "media_gallery_entries": [{
                    "id": null,
                    "mediaType":"image",
                    "label":"Foto",
                    "position": 0,
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
                }]`
        })
        imagems.foto.forEach(element => {
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
            if (x != imagems.foto.length) {
                img_json += ','
            }
            if (x == imagems.foto.length) {
                img_json += `]`
                console.log('principall: ' + img_princi + ' imagems: ' + img_json)
                ProdutoModel.putProduto(res, obj, img_json, img_princi)
            }
            x++
            unlink(element.path)
        })

    }
    else {
        ProdutoModel.putProduto(res, obj)
    }
}

const apagar = async function (req, res) {
    let params = req.params
    ProdutoModel.deleteProduto(params.id)
    ProdutoModel.getProduto(res, "Produto Deletado!")
}

const atualiza_mage = async function (req, res) {

    bd.query('SELECT * FROM product', function (err, rows, fields) {

        rows.forEach(element => {
            if (element.active == 'S') {
                main(element)
            }
        })
        res.render("produtos/produtos", {
            msg: "Produto atualzado na Loja!!!",
            produtos: rows
        })
    })
}

const cad_prod_unic = async function (req, res) {

    let params = req.params

    bd.query('SELECT * FROM product WHERE hrd_D009_Id = "' + params.D009_Id + '"', function (err, rows, fields) {

        rows.forEach(element => {
            main(element)
        })
    })
    bd.query('SELECT * FROM product', function (err, rows, fields) {
        res.render("produtos/produtos", {
            msg: "Produto atualzado na Loja!!!",
            produtos: rows
        })
    })

}

const atualiza_base = async function (req, res) {
    ProdutoModel.atualizaBase(res)
}

const base64_encode = function (file) {
    var bitmap = fs.readFileSync(file)
    return new Buffer(bitmap).toString('base64')
}

module.exports = {
    produtos,
    novo,
    salva_form,
    form_atualiza,
    atualiza,
    apagar,
    atualiza_mage,
    cad_prod_unic,
    atualiza_base,
    base64_encode
}