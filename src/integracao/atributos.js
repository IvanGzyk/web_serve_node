
const prod_mag = require("./produtos")

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

// let D0id = {
//     $or: [{ "attribute_set_name": "D0_Ids" }],
//     $perPage: 200,
//     $page: 1
// }

// prod_mag.getGrupoAtributosSet(D0id).then(data => data.data).then(items => items.items).then(item => {
//     if (item.length == 0) {
//         var grup_atributos = {
//             "attributeSet": {
//                 "attribute_set_name": "D0_Ids",
//                 "sort_order": 10,
//                 "entity_type_id": 4
//             },
//             "skeletonId": 4
//         }

//         prod_mag.postGrupoAtributos(grup_atributos)
//     }
// })

function cadastraAtributos(params, code, label) {
    // let D0id = {
    //     $or: [{ "attribute_set_name": "D0_Ids" }],
    //     $perPage: 200,
    //     $page: 1
    // }
    // prod_mag.getGrupoAtributosSet(D0id).then(data => data.data).then(items => items.items).then(item => {
    //     console.log(item[0].attribute_set_id)
    prod_mag.GetProdutosAtributos(params).then(data => data.data).then(item => {

            var atributo = item.items
            var atribFornece = false
            var jsonAtribute

            atributo.forEach(atrib => {
                //console.log(atrib)
                attribute_id = atrib.attribute_id
                options = atrib.options
                options.forEach(opt => {
                    if (opt.label == fornecedor) {
                        atribFornece = true
                    }
                })
            })
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
                prod_mag.postProdutosAtributos(jsonAtribute).then(dados => {
                    if (dados != undefined) {
                        //console.log(dados)
                        dados = dados.data
                        var attribute_id = dados.attribute_id
                        var jsonSetAtri = `{
                            "attributeSetId": ${attribute_id},
                            "attributeGroupId": 4,
                            "attributeCode": "${code}",
                            "sortOrder": 0
                        }`
                        prod_mag.postGrupoAtributos(jsonSetAtri)/*.then(dados => dados.data)*/.then(console.log)
                    }
                })
            }
        // })
    })
}