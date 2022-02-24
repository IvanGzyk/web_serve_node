
const multer = require("multer")
const Produtos = require('../controllers/Produtos')
var produto = Produtos.Produtos
module.exports = function (application) {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/img/upload/file')
        },
        filename: function (req, file, cb) {
            const extensaoArquivo = file.originalname.split('.')[1]
            const novoNomeArquivo = require('crypto')
                .randomBytes(5)
                .toString('hex')
            cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
        }
    })

    const upload = multer({ storage: storage })

    application.get('/produtos', function (req, res) {
        application.src.controllers.Produtos.produtos(application, req, res)
    })

    application.get('/form', function (req, res) {
        application.src.controllers.Produtos.novo(req, res)
    })

    application.post('/salva_form', upload.fields([{ name: 'foto', maxCount: 10 }, { name: 'imagem' }]), (req, res, next) => {
        application.src.controllers.Produtos.salva_form(req, res, next)
    })

    application.get('/form_update/:id', function (req, res) {
        application.src.controllers.Produtos.form_atualiza(req, res)
    })

    application.post('/form_atualizar', upload.fields([{ name: 'foto', maxCount: 10 }, { name: 'imagem'}]), (req, res, next) => {
        application.src.controllers.Produtos.atualiza(req, res)
    })

    application.get('/delete/:id', function (req, res, next) {
        application.src.controllers.Produtos.apagar(req, res)
    })

    application.get('/cadastra', function (req, res) {
        application.src.controllers.Produtos.atualiza_mage(req, res)
    })

    application.get('/atualiza_base', function (req, res) {
        application.src.controllers.Produtos.atualiza_base(req, res)
    })

    application.get('/cad_unic/:D009_Id/:sku', function (req, res) {
        application.src.controllers.Produtos.cad_prod_unic(req, res)
    })
}