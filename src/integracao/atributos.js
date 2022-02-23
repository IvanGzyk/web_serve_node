
const prod_mag = require("./produtos")
const funcoes = require('../util/Util').Util

let fornecedor_set = {
    $or: [{ "attribute_set_name": "Fornecedor" }],
    $perPage: 200,
    $page: 1
}

pegaAtributoSet = async function (params) {
    atrib = await prod_mag.getGrupoAtributosSet(params)
    return funcoes.atributoSet(atrib)
}

pegaAtributo = async function (params) {
    atrib = await prod_mag.GetProdutosAtributos(params)
    return funcoes.atributoSet(atrib)
}

criaGrupoAtributos = async function (params) {
    await prod_mag.postGrupoAtributos(params).then(data => {
        attribute_set_id = data.attribute_set_id
    })
}

cadastraAtributoProduto = async function (params) {
    var data = await prod_mag.postProdutosAtributos(params)
    return funcoes.retornaData(data)
}

pegaAtributoSet(fornecedor_set).then(item => {
    if (item.length == 0) {
        var grup_atributos = {
            "skeletonId": 4,
            "attributeSet": {
                "attribute_set_id": null,
                "attribute_set_name": "Fornecedor",
                "sort_order": 2,
                "entity_type_id": 0,
                "extension_attributes": null
            },
            "entityTypeCode": "catalog_product"
        }
        jsonAtribute = {
            "attribute": {
                "is_wysiwyg_enabled": false,
                "is_html_allowed_on_front": true,
                "used_for_sort_by": false,
                "is_filterable": true,
                "is_filterable_in_search": true,
                "is_used_in_grid": true,
                "is_visible_in_grid": true,
                "is_filterable_in_grid": true,
                "position": 0,
                "apply_to": [
                    "simple",
                    "configurable",
                    "virtual"
                ],
                "is_searchable": true,
                "is_visible_in_advanced_search": true,
                "is_comparable": "0",
                "is_used_for_promo_rules": "0",
                "is_visible_on_front": true,
                "used_in_product_listing": "0",
                "is_visible": true,
                "scope": "store View",
                "attribute_code": "fornecedor",
                "frontend_input": "select",
                "entity_type_id": "4",
                "is_required": false,
                "default_value": "",
                "is_user_defined": true,
                "frontend_labels": [
                    {
                        "storeId": 0,
                        "label": "Fornecedor"
                    }
                ],
                "default_frontend_label": "Fornecedor",
                "backend_type": "varchar",
                "source_model": null,
                "is_unique": "0",
                "validation_rules": null
            }
        }

        criaGrupoAtributos(grup_atributos)
        cadastraAtributoProduto(jsonAtribute).then(data => {
            if (data != undefined) {
                data = data.data
                attribute_id = data.attribute_id
                var jsonSetAtri = {
                        "attributeSetId": attribute_id,
                        "attributeGroupId": 4,
                        "attributeCode": "fornecedor",
                        "sortOrder": 0
                    }
                criaGrupoAtributos(jsonSetAtri)
            }
        })
    }
})

let D009_Id = {
    $or: [{ "attribute_code": "id_d009" }],
    $perPage: 200,
    $page: 1
}

cadastraAtributos(D009_Id, "id_d009", "ID_D009")

let D049_para = {
    $or: [{ "attribute_code": "d049_id" }],
    $perPage: 200,
    $page: 1
}

cadastraAtributos(D049_para, "d049_id", "D049_ID")

let D001_para = {
    $or: [{ "attribute_code": "doo1_id" }],
    $perPage: 200,
    $page: 1
}
cadastraAtributos(D001_para, "d001_id", "D001_ID")

function cadastraAtributos(params, code, label) {
    pegaAtributo(params).then(item => {
        var atributo = item
        var atribFornece = false
        var jsonAtribute
        
        if (item.length != 0) {
            atributo.forEach(atrib => {
                attribute_id = atrib.attribute_id
                options = atrib.options
                options.forEach(opt => {
                    if (opt.label == label) {
                        atribFornece = true
                    }
                })
            })
        }
        if (atribFornece == false) {
            jsonAtribute = `{
                "attribute":{
                    "is_wysiwyg_enabled": false,
                    "is_html_allowed_on_front": true,
                    "used_for_sort_by": false,
                    "is_filterable": false,
                    "is_filterable_in_search": false,
                    "is_used_in_grid": true,
                    "is_visible_in_grid": true,
                    "is_filterable_in_grid": true,
                    "position": 0,
                    "is_searchable": "0",
                    "is_visible_in_advanced_search": "0",
                    "is_comparable": "0",
                    "is_used_for_promo_rules": "0",
                    "is_visible_on_front": "0",
                    "used_in_product_listing": "0",
                    "is_visible": true,
                    "scope": "store",
                    "attribute_code": "${code}",
                    "frontend_input": "text",
                    "entity_type_id": "4",
                    "is_required": false,
                    "is_user_defined": true,
                    "default_frontend_label": "${label}",
                    "backend_type": "varchar",
                    "is_unique": "0"
                }
            }`
            cadastraAtributoProduto(jsonAtribute).then(dados => {
                if (dados != undefined) {
                    dados = dados.data
                    var attribute_id = dados.attribute_id
                    var jsonSetAtri = `{
                            "attributeSetId": ${attribute_id},
                            "attributeGroupId": 4,
                            "attributeCode": "${code}",
                            "sortOrder": 0
                        }`
                    prod_mag.postGrupoAtributos(jsonSetAtri)
                }
            })
        }
    })
}

module.exports = { pegaAtributoSet, pegaAtributo, criaGrupoAtributos, cadastraAtributoProduto}