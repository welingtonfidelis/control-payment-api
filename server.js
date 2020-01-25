const express = require('express');
const cors = require('cors')
const port = 3001

const app = express();

//Aceita dados do tipo json
app.use(express.json())

//permite acesso à api de qualquer dominio 
app.use(cors())

//roteamento
app.use('/api', require('./src/route'))

app.listen(port, function () {
    console.log(`Servidor rodando na porta ${port}`);
});
