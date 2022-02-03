const axios = require('axios')

module.exports = class LaraDb {
    url
    constructor(limit = 15, page = 1, order = 'company_name', direction = 'ASC', fields = 'id', search = 'Busca', searchLike = 'Incremental', relations = 'Rela%C3%A7%C3%A3o') {
        this.limit = limit
        this.page = page
        this.order = order
        this.direction = direction
        this.fields = fields
        this.search = search.replace('=', '%3D')
        this.searchLike = searchLike
        this.relations = relations
        this.url = 'http://192.168.11.66:8000/api'
    }

    GeraParamsUrl() {
        var geturl = `?limit=${this.limit}&page=${this.page}&order=${this.order}&direction=${this.direction}&fields=${this.fields}&search=${this.search}&searchLike=${this.searchLike}&relations=${this.relations}`
        return geturl
    }

    EntriesBusinessPartners() {
        var params = this.GeraParamsUrl()
        var url = this.url
        const laraDb = axios.create({
            baseURL: `${url}`,
            timeout: 1000,
            headers: { 'X-Custom-Header': 'foobar' }
        })

        async function getPartnersAdsresses(params) {
            try {
                const response = await laraDb.get(`/entriesBusinessPartners${params}`)
                return response
            } catch (error) {
                console.error(error)
            }
        }
        var data = getPartnersAdsresses(params)
        return data
    }

}

//module.exports.LaraDb = new LaraDb()