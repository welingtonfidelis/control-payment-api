require('dotenv-safe').config();

const express = require('express');
const cors = require('cors')
const port = 3001
const app = express();

const routine = require('./src/services/Routine');

//Aceita dados do tipo json
app.use(express.json());

//permite acesso à api de qualquer dominio 
app.use(cors());

//roteamento
app.use('/api', require('./src/route'));

app.listen(process.env.PORT || port, function () {
    console.log(`Server running in ${port}\n`);

    //ROTINAS
    //email de lembrete de contribuição próxima
    routine.sendEmailReminder();

    //manter servidor heroku ativo 
    // routine.wakeUpDyno();
});
