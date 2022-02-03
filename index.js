
const bodyParser = require('body-parser')
const express = require('express')
const consign = require('consign')

const app = express();
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.set('views', './src/views');

consign()
    .include('src/routes')
    .then('src/models')
    .then('src/controllers')
    .then('src/integracao')
    .into(app);

app.listen('3000', function () {
    console.log('APP rodando na porta 3000');
});