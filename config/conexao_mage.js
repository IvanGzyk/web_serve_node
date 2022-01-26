var Magento = require('magento-api-rest').default

const client = new Magento({
    'url': 'http://192.168.0.241:5000/magento2',
    'consumerKey': 'apifprjlc5t2zhi1c2iqxx31uqno7zbx',
    'consumerSecret': 'd2d7hku25tpi31bxcmpcmtgjm9ttvuvz',
    'accessToken': '4xad9stz1zdf8tr18xvxxojtwez3vyx7',
    'tokenSecret': 's5ewe8s2dyktstrtqelv5gedyc6q4njz',
})

module.exports.client = client