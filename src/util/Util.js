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

}
module.exports.Util = new Util()