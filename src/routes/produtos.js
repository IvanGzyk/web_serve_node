
const multer = require("multer")

module.exports = function (application) {

    // Configuração de armazenamento
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/img/upload/file')
        },
        filename: function (req, file, cb) {
            // Extração da extensão do arquivo original:
            const extensaoArquivo = file.originalname.split('.')[1]

            // Cria um código randômico que será o nome do arquivo
            const novoNomeArquivo = require('crypto')
                .randomBytes(5)
                .toString('hex')

            // Indica o novo nome do arquivo:
            cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
        }
    });

    const upload = multer({storage : storage, limits: {
        fileSize : 1024 * 1024 * 5 
    }})
    
    application.get('/produtos', function (req, res) {
        application.src.controllers.produtos.produtos(application, req, res)
    })

    application.get('/form', function (req, res) {
        application.src.controllers.produtos.novo(req, res)
    })

    application.post('/salva_form', upload.array("foto", 10), (req, res) => {
        application.src.controllers.produtos.salva_form(req, res)
    })

    application.get('/form_update/:id', function (req, res) {
        application.src.controllers.produtos.form_atualiza(req, res)
    })

    application.post('/form_atualizar', upload.array("foto", 10), (req, res) => {
        //console.log(req)
        application.src.controllers.produtos.atualiza(req, res)
    })

    application.get('/delete/:id', function (req, res) {
        application.src.controllers.produtos.apagar(req, res)
    })

    application.get('/cadastra', function (req, res) {
        application.src.controllers.produtos.cad_prod_mage(req, res)
    })

    application.get('/atualiza_base', function (req, res) {
        application.src.controllers.produtos.atualiza_base(req, res)
    })
}