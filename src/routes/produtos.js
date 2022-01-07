
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
    });

    const upload = multer({storage : storage, limits: {
        fileSize : 1024 * 1024 * 5 
    }})
    
    application.get('/produtos', function (req, res) {
        produto.produtos(application, req, res)
    })

    application.get('/form', function (req, res) {
        produto.novo(req, res)
    })

    application.post('/salva_form', upload.array("foto", 10), (req, res) => {
        produto.salva_form(req, res)
    })

    application.get('/form_update/:id', function (req, res) {
        produto.form_atualiza(req, res)
    })

    application.post('/form_atualizar', upload.array("foto", 10), (req, res) => {
        produto.atualiza(req, res)
    })

    application.get('/delete/:id', function (req, res) {
        produto.apagar(req, res)
    })

    application.get('/cadastra', function (req, res) {
        produto.atualiza_mage(req, res)
    })

    application.get('/atualiza_base', function (req, res) {
        produto.atualiza_base(req, res)
    })

    application.get('/cad_unic/:D009_Id/:sku', function (req, res) {
        produto.cad_prod_unic(req, res)
    })
}