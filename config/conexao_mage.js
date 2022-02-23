var Magento = require('magento-api-rest').default

/** Alterar url e Keys quando for para loja oficial */
const client = new Magento({
    'url': 'http://192.168.0.241:5000/magento2',
    'consumerKey': '32b9ok6mn2tcits7z0njds2fkhazmg0u',
    'consumerSecret': 'uicwtwgb1wfz0gauxzqex623anu2hhx8',
    'accessToken': '4ythp97po6xw4pw271tjhwy58fhe2eul',
    'tokenSecret': '3vv4ewt27gdtlx8eetyilvlzd4ihzznn',
})

module.exports.client = client