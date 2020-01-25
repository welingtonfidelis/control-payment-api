const express = require('express');
const cors = require('cors')
const port = 3001

const app = express();

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'user';
const someOtherPlaintextPassword = 'adm124';
const hash = '$2b$10$6db/DiUiPrL6umMQ6K3A4.7LYLtmQnhVqt/jzrsQRYNEOqcPhdDj6';

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        console.log(hash);
        
    });
});

bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
    console.log(res);
    
});
// bcrypt.compare(someOtherPlaintextPassword, hash, function(err, res) {
//     console.log(res);
    
// });

//Aceita dados do tipo json
app.use(express.json())

//permite acesso à api de qualquer dominio 
app.use(cors())

//roteamento
app.use('/api', require('./src/route'))

app.listen(port, function () {
    console.log(`Servidor rodando na porta ${port}`);
});
