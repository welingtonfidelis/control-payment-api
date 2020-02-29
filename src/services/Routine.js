const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const axios = require('axios').default;
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');

const DonationController = require('../controllers/DonationController');

module.exports = {
    sendEmailReminder() {
        console.log('Routine running -> mail reminder ');

        //executa a verificação assim que a rotina é iniciada
        // searchTaxpayer();

        //cria chamada recorrente (todos os dias às 9 da manhã) para enviar 
        //emails de lembretes das contribuições próximas de vencimento
        const job = new CronJob('00 00 12 * * 0-6', function () {
            searchTaxpayer();
        });
        job.start();
    },

    wakeUpDyno() {
        console.log('Routine running -> wakeUpDyno ');

        sendRequestWakeUp();

        //cria chamada recorrente (à cada 29m) para enviar requisição
        //à própria api para mantê-la acordada 
        //(servidor heroku coloca app em repouso 30m sem uso)
        const job = new CronJob('0 */29 * * * *', function () {
            sendRequestWakeUp();
        });
        job.start();
    }
}

function sendRequestWakeUp() {
    const dthr = format(new Date(), 'dd/mm/yyyy HH:MM:ss', { locale: ptBR });
    console.log(`\n${dthr} start routine wakeUpDyno`);

    try {
        axios.get('https://ctrl-receive-ong-api.herokuapp.com/api/hello');

    } catch (error) {
        const err = error.stack || error.errors || error.message || error;
        console.log(err);
    }
}

async function searchTaxpayer() {
    const dthr = format(new Date(), 'dd/mm/yyyy HH:MM:ss', { locale: ptBR });
    const month = format(new Date(), 'MMMM', { locale: ptBR });

    console.log(`\n${dthr} start routine sendMail`);

    const resp = await DonationController.returnDonationReceive(1, null, null, { first: 2, second: 7 });
    const { taxpayer } = resp;

    taxpayer.forEach(el => {
        const { Payment } = el;
        const { Ong } = el;
        const social1 = Ong.social1 ? Ong.social1 : '';
        const social2 = Ong.social2 ? Ong.social2 : '';

        const msg = `
            <h4>Olá ${el.name}.</h4>
            <div>
                Estamos passando pra lembrá-lo que
                que sua contribuição de R$${Payment.value} do mês de ${month} 
                está próxima de vencer (dia ${Payment.expiration}).
                </p>
                Agradecemos muito pela sua contribuição mensal e gostaríamos de
                ressaltar o quanto ela ajuda a salvar muitos animais em situação de 
                risco e vulnerabilidade.
                </p>

                <br><br>
                Atenciosamente, <strong>${Ong.name}</strong>.
                <p>${Ong.email}</p>
                <p>${social1}</p>
                <p>${social2}</p>
                <br>
            </div> `;

        sendEmail(month, el.email, msg);
    });
}

async function sendEmail(month, email, msg) {
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWD
        }
    });

    try {
        const resp = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: `Contribuição do mês de ${month}.`,
            // text: 'That was easy!',
            html: msg,
        });

        console.log("Message sent: %s", resp.messageId);

    } catch (error) {
        const err = error.stack || error.errors || error.message || error;
        console.log(err);
    }
}
