const ProdutoModel = require('../models/produtos')
const Categorias = require('../integracao/categorias')
const fs = require('fs');
const db_eco = require("../../config/db")
const prod_mag = require("../integracao/produtos")
const atribu = require("../integracao/atributos")
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
    try {
        atrib = await prod_mag.GetProdutosAtributos(para)
        return funcoes.atributo(atrib)
    } catch (error) {
        console.error(error)
    }
}

async function cadastraAtributo(attribute_id, fornecedor) {
    try {
        jsonAtribute = `{
            "attribute": {
                "position": 0,
                "used_in_product_listing": "true",
                "attribute_id": ${attribute_id},
                "options": [
                    {
                        "label": "${fornecedor}"
                    }
                ]
            }
        }`
        await prod_mag.putProdutosAtributos(attribute_id, jsonAtribute)
    } catch (error) {
        console.error(error)
    }
}

async function pegaProduto(sku) {
    try {
        dados = await prod_mag.getProduto(sku)
        return funcoes.pegaProduto(dados)
    } catch (error) {
        console.error(error)
    }
}

async function cadastraProduto(params) {
    try {
        dados = await prod_mag.postProduto(params)
        return funcoes.retornaData(dados)
    } catch (error) {
        console.error(error)
    }
}

async function cadastraProdutoConfiguravel(sku, option) {
    try {
        if (option != undefined) {
            dados = await prod_mag.ProdutoConfigurableOptions(sku, option)
        }
    } catch (error) {
        console.error(error)
    }
}

async function atualizaProduto(sku, params) {
    try {
        dados = await prod_mag.putProduto(sku, params)
        return funcoes.retornaData(dados)
    } catch (error) {
        console.error(error)
    }
}

async function VinculaSimplesConfiguravel(element, sku) {
    try {
        prod_mag.addProdutoSimple(element.product_code, `{"childSku": "${sku}"}`);
    } catch (error) {
        console.error(error);
    }
}

function CadastraSimples(items, element, json, sku) {
    try {
        if (items.length != 0) {
            try {
                atualizaProduto(sku, json).then(data => {
                    let dados = data.data;
                    let img = dados.media_gallery_entries;
                    var img_local = element.img;
                    img_local = img_local.replace('"media_gallery_entries":', '');
                    img_local = JSON.parse(img_local);
                    const img_json = funcoes.salva_id_img(img_local, img);
                    ProdutoModel.putImg(element.id, img_json);
                    VinculaSimplesConfiguravel(element, sku).then(data => {
                        ProdutoModel.atualizaValorProdLoja(dados.price, element.id);
                    })
                })
            } catch (error) {
                console.error(error);
            }
        } else if (element.active != 'N') {
            try {
                cadastraProduto(json).then(data => {
                    let dados = data.data;
                    let img = dados.media_gallery_entries;
                    var img_local = element.img;
                    img_local = img_local.replace('"media_gallery_entries":', '');
                    img_local = JSON.parse(img_local);
                    const img_json = funcoes.salva_id_img(img_local, img);
                    ProdutoModel.putImg(element.id, img_json);
                    VinculaSimplesConfiguravel(element, sku).then(data => {
                        ProdutoModel.atualizaValorProdLoja(dados.price, element.id);
                    })
                })
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

function PegaProdutaCode(element, json, sku) {
    try {
        pegaProduto(element.product_code).then(items => {
            CadastraSimples(items, element, json, sku);
        })
    } catch (error) {
        console.error(error);
    }
}

function CadastraOpcoesConfiguravel(element, options, json, sku) {
    try {
        cadastraProdutoConfiguravel(element.product_code, options).then(dados => {
            PegaProdutaCode(element, json, sku);
        })
    } catch (error) {
        console.error(error)
    }
}

function CadastraConfiguravel(json_configurable, element, options, json, sku) {
    try {
        if (json_configurable != undefined) {
            try {
                cadastraProduto(json_configurable).then(dados => {
                    CadastraOpcoesConfiguravel(element, options, json, sku);
                })
            } catch (error) {
                console.error(error);
            }
        } else {
            CadastraOpcoesConfiguravel(element, options, json, sku);
        }
    } catch (error) {
        console.error(error);
    }
}

function JsonConfiguravel(element, name, id_d009, category, qty, img_configuravel, attribute_id, value_index, json, sku, atributo_set_id) {
    try {
        pegaProduto(element.product_code).then(data => {
            var json_configurable;
            var options;
            if (data.length == 0) {
                json_configurable = `{
                    "product":
                        {
                            "sku": "${element.product_code}",
                            "name": "${name}-${id_d009}",
                            "attribute_set_id": ${atributo_set_id},
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
                                    "value": "Colocar aqui a descri????o do produto..."
                                },
                                {
                                    "attribute_code": "id_d009",
                                    "value": "${id_d009}"
                                }
                            ]
                        }
                    }`;
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
                    }`;
            };
            CadastraConfiguravel(json_configurable, element, options, json, sku);
        })
    } catch (error) {
        console.error(error);
    }
}

function GeraraAtributo(element) {

    let para = {
        $or: [{ "attribute_code": "fornecedor" }],
        $perPage: 200,
        $page: 1
    }

    let fornecedor_set = {
        $or: [{ "attribute_set_name": "Fornecedor" }],
        $perPage: 200,
        $page: 1
    }
    try {
        atributos(para).then(atrib => {
            var forn = element.fornecedor.split(" - ")
            fornecedor = forn[0].split(" ")
            fornecedor = fornecedor[0]
            if (forn.length == 2) {
                trade = forn[1].split(" ")
                fornecedor = fornecedor + ' ' + trade[0]
            }

            attribute_id = atrib.attribute_id;
            options = atrib.options;
            (async () => {
                options.forEach(opt => {
                    if (opt.label == fornecedor) {
                        atribFornece = true;
                    }
                });
            })().then(dados => {
                if (atribFornece == false) {
                    cadastraAtributo(attribute_id, fornecedor).then(dados => {
                        Simples();
                    });
                } else {
                    Simples();
                }
            })
        })
    } catch (error) {
        console.error(error)
    }
    function Simples() {
        try {
            atributos(para).then(atrib => {
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
                atribu.pegaAtributoSet(fornecedor_set).then(item => {
                    if (item.length != 0) {
                        var atributo_set_id = item[0].attribute_set_id
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
                                    "attribute_set_id": ${atributo_set_id},
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
                                            "value": "Colocar aqui a descri????o do produto..."
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
                        };
                        JsonConfiguravel(element, name, id_d009, category, qty, img_configuravel, attribute_id, value_index, json, sku, atributo_set_id);
                    }
                })
            })
        } catch (error) {
            console.error(error)
        }
    }
}

const atualiza_mage = function (req, res) {
    try {
        bd.query('SELECT * FROM product', function (err, rows, fields) {
            rows.forEach(element => {
                if (element.active == 'S') {
                    GeraraAtributo(element)
                }
            })
            res.render("produtos/produtos", {
                msg: "Produto atualzado na Loja!!!",
                produtos: rows
            })
        })
    } catch (error) {
        HTMLFormControlsCollection(error)
    }
}

const cad_prod_unic = function (req, res) {
    let params = req.params
    try {
        bd.query('SELECT * FROM product WHERE hrd_D009_Id = "' + params.D009_Id + '"', function (err, rows, fields) {
            rows.forEach(element => {
                GeraraAtributo(element)
            })
        })
    } catch (error) {
        console.error(error)
    }
    try {
        bd.query('SELECT * FROM product', function (err, rows, fields) {
            res.render("produtos/produtos", {
                msg: "Produto atualzado na Loja!!!",
                produtos: rows
            })
        })
    } catch (error) {
        console.error(error)
    }

}

const produtos = function (application, req, res) {
    try {
        ProdutoModel.getProduto(res)
    } catch (error) {
        console.error(error)
    }
}

const novo = function (req, res) {

    try {
        Categorias.getCategorias()
            .then(dados => dados.data)
            .then(dados => {
                res.render("form/cadastro_produto", { categorias: dados.children_data })
            })
    } catch (error) {
        console.error(error)
    }
}

const salva_form = function (req, res) {
    var img_json = ''
    var img_princi = ''
    var x = 1
    var bd = db_eco.eco_db
    req.files.forEach(element => {
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

const form_atualiza = function (req, res) {
    Categorias.getCategorias()
        .then(dados => dados.data)
        .then(dados => {
            let params = req.params
            var bd = db_eco.eco_db
            try {
                bd.query('SELECT * FROM product where id = ' + params.id, function (err, rows, fields) {
                    res.render("form/atualizar", { produtos: rows, categorias: dados.children_data })
                })
            } catch (error) {
                console.error(error)
            }
        })
}

const atualiza = function (req, res) {
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

    if (imagems) {
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

const apagar = function (req, res) {
    let params = req.params
    ProdutoModel.deleteProduto(params.id)
    ProdutoModel.getProduto(res, "Produto Deletado!")
}

const atualiza_base = function (req, res) {
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