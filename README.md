# webserver_nodejs integrado com APIS Magento
1. Configuração Rest_api_magento
* Config
    * conexao_mage.js
    
    **Colocar a url da loje e as chaves geradas no adim do magento**
    
    ```const client = new Magento({
    'url': 'site da loja magento',
    'consumerKey': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'consumerSecret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'accessToken': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'tokenSecret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    })
    ```
2. Organização das pastas

    **config** arquivos de configuração (sql, e api magento)

    **node_module** modulos do nodejs

    **public** arquivos staticos (css, js, img)

    **src** aplicação 

        *controllers
        *integracao
        *models
        *routers
        *views

    **controllers** classes controladoras

    **integracao** arquivos de integração com magento e sistema da empresa

    **models** modelos de banco de dados

    **routers** arquivos de rotas 

    **views** arquivas de vizualização (layout)
    
3. Configuração do Servidor

    ```
    const bodyParser = require('body-parser')
    const express = require('express')
    const consign = require('consign')

    //Define as configuração do Servidor
    const app = express();
    app.use(express.static('./public'))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.set('view engine', 'ejs');
    app.set('views', './src/views');

    //Define quais as pastas serão carregadas junto com o servidor
    consign()
        .include('src/routes')
        .then('src/models')
        .then('src/controllers')
        .then('src/integracao')
        .into(app);

    //Define a porta que o servidor ira rodar
    app.listen(3000, function () {
        console.log('APP rodando na porta 3000');
    });
    ```
4. CRUD de Produtos

    * Traz todos os Produtos

        ```
        async function getProdutos() {
            try {
                let dados = client.get('products')
                return dados
            } catch (err) {
                console.log(err)
            }
        }
    * Uso

        ```
        getProdutos()
            .then(data => data.data)
            .then(console.log)
        ```

    * Traz um unico Produto
        ```
        async function postProduto(json) {
            try {
                client.post('products', json)
            } catch (err) {
                console.log(err)
            }
        }
        ```
    * Uso
        ```
        getProduto('pistao')
            .then(data => data.data)
            .then(console.log)
        ```
    
    * Cadastrar Produto
        ```
        async function postProduto(json) {
            try {
                client.post('products', json)
            } catch (err) {
                console.log(err)
            }
        }
        ```
    * Uso
        ```
        postProduto(json)
        ```
        **OBS... (Para Cadastrar e Atualizar pode usuar a mesma função, apenas alterando o Json)**


    * exemplo de Json para cadastrar

        ```
        {
            "product": {
                "sku": "pistao",
                "name": "pistao",
                "price": 650,
                "status": 1,
                "type_id": "simple",
                "visibility": 4,
                "attribute_set_id": 4,
                "weight": 1,
                "extension_attributes": {
                    "website_ids": [
                        1
                    ],
                    "category_links": [
                        {
                            "position": 1,
                            "category_id": "5"
                        }
                    ],
                    "stock_item": 
                        {
                            "qty": 15,
                            "is_in_stock": true,
                            "is_qty_decimal": true
                        }
                },
                "custom_attributes": [
                    {
                        "attribute_code": "id_d009",
                        "value": "25150"
                    }
                ]
            }
        }
        ```
    