var Magento = require('magento-api-rest').default

const client = new Magento({
    'url': 'http://192.168.0.241:5000/magento2',
    'consumerKey': '32b9ok6mn2tcits7z0njds2fkhazmg0u',
    'consumerSecret': 'uicwtwgb1wfz0gauxzqex623anu2hhx8',
    'accessToken': '7ksd4d0lmlftne963taj6w2vmdil7lbj',
    'tokenSecret': '099tmurmr8ep68zxctd0m47r50y50p57',
})

module.exports.client = client