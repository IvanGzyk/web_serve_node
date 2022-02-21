const funcoes = require('../util/Util').Util
const CronJob = require('cron').CronJob
const ModelsCustomers = require('../models/customers')
const IntegracaoCustomers = require('../integracao/customers')
const ControllersCustomers = require('../controllers/Customers')
var customers = ControllersCustomers.Customers


/** Verifica novos clientes a cada 5 minutos */
const job = new CronJob('*/30 */1 * * * *', () => {

    data_atual = funcoes.dataAtual() /** data atual */
    data_inicio = funcoes.dataDeInicio(-5) /** data atual menos 5 minutos */

    let params = {
        $from: data_inicio,
        $to: data_atual,
        $sort: {
            "created_at": "desc"
        },
        $perPage: 200,
        $page: 1
    }

    IntegracaoCustomers.getCustomers(params).then(data => data.data).then(items => customers.SalvaCustomers(items))
    console.log('Clientes atualizado em: ' + data_atual)
}, null, true, 'America/Sao_Paulo')

const job2 = new CronJob('10 */1 * * * *', () => {
    data_busca = funcoes.dataDeInicio(-1)
    ModelsCustomers.getCustomers(data_busca).then(dados => {
        customers.SalvaClienteLaraApi(dados)
    })
}, null, true, 'America/Sao_Paulo')