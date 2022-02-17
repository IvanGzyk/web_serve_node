const axios = require('axios')

module.exports = class LaraDb {
    url
    constructor(relations = 'Relação') {
        this.relations = encodeURI(relations)
        this.url = 'http://192.168.0.240:9000/api'
    }

    ApiLaravel() {
        return axios.create({
            baseURL: `${this.url}`,
            timeout: 1000,
            headers: { 'X-Custom-Header': 'foobar' }
        })
    }

    GeraParamsUrl() {
        var geturl = `?relations=${this.relations}`
        return geturl
    }
}