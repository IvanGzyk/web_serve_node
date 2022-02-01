class Util {
    constructor(){

    }
    
    calculaData(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }

    dataAtual(){
        var data = new Date()
        var ano = data.getFullYear()
        var mes = String(data.getMonth() + (1)).padStart(2, '0')
        var dia = String(data.getDate()).padStart(2, '0')
        var hora = String(data.getHours()).padStart(2, '0')
        var minuto = String(data.getMinutes()).padStart(2, '0')
        var segundos = String(data.getSeconds()).padStart(2, '0')
        var data_atual = ano + '-' + mes + '-' + dia + ' ' + hora + ':' + minuto + ':' + segundos
        return data_atual
    }

    dataDeInicio(tempo){
        var data = new Date()
        var dataIni = this.calculaData(data, tempo)
        var anoIni = dataIni.getFullYear()
        var mesIni = String(dataIni.getMonth() + (1)).padStart(2, '0')
        var diaIni = String(dataIni.getDate()).padStart(2, '0')
        var horaIni = String(dataIni.getHours()).padStart(2, '0')
        var minutoIni = String(dataIni.getMinutes()).padStart(2, '0')
        var segundosIni = String(dataIni.getSeconds()).padStart(2, '0')

        var data_inicio = (anoIni - 1) + '-' + mesIni + '-' + diaIni + ' ' + horaIni + ':' + minutoIni + ':' + segundosIni
        return data_inicio
    }

    salva_id_img(img_local, img_magento){
        let x = 1
        let img_json
        img_local.forEach(local => {
            img_magento.forEach(magento => {
                if (magento.label == local.label){
                    local.id = magento.id
                }
            })
            var content = JSON. stringify(local.content)
            if (x == 1){                
                img_json = img_json = `
                "media_gallery_entries": [
                    {
                        "id": ${local.id},
                        "mediaType":"${local.mediaType}",
                        "label":"${local.label}",
                        "position": ${local.position},
                        "disabled": ${local.disabled},
                        "types":[
                            "image",
                            "small_image",
                            "thumbnail"
                        ],
                        "content":${content}
                    }`
            } else {
                img_json += `{
                    "id": ${local.id},
                    "mediaType":"${local.mediaType}",
                    "label":"${local.label}",
                    "position": ${local.position},
                    "disabled": ${local.disabled},
                    "types":[
                        "image",
                        "small_image",
                        "thumbnail"
                    ],
                    "content":${content}
                }`
            }
            if (x != img_local.length) {
                img_json += ','
            }
            if (x == img_local.length) {
                img_json += `]`
            }
            x++
        })
        return img_json
    }

    atributo(atri){
        //console.log(atri.data.items)
        var attribute
        var atributo = atri.data.items
        atributo.forEach(atrib => {
            attribute = atrib
        })
        return attribute
    }
    pegaProduto(dados){
        var items = dados.data.items
        return items
    }

    atributoSet(atrib){
        var data = atrib.data
        var items = data.items
        return items
    }
    
    retornaData(dados){
        //console.log(dados)
        return dados
    }
}
module.exports.Util = new Util()