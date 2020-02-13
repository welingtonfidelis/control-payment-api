const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const dateFormat = require('dateformat');

const DonationController = require('../controllers/DonationController');

dateFormat.i18n = {
    dayNames: [
        'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab',
        'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'
    ],
    monthNames: [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    timeNames: [
        'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    ]
};

module.exports = {
    sendEmailReminder() {
        console.log('Run routine email reminder');

        //executa a verificação assim que a rotina é iniciada
        // searchTaxpayer();

        //cria chamada recorrente (job) para enviar 
        //emails de lembretes das contribuições próximas de vencimento
        const job = new CronJob('00 00 09 * * 0-6', function () {
            searchTaxpayer();
        });
        job.start();
    }
}

async function searchTaxpayer() {
    const dthr = dateFormat(new Date(), 'dd/mm/yyyy HH:MM:ss');
    const month = dateFormat(new Date(), 'mmmm');

    console.log(`\n${dthr} start routine`);

    const resp = await DonationController.returnDonationReceive(1, null, { first: 2, second: 7 });
    const { taxpayer } = resp;

    taxpayer.forEach(el => {
        const { Payment } = el;

        const msg = `
            <h4>Olá ${el.name}.</h4>
            <div>
                Estamos passando pra lembrá-lo que
                que sua contribuição de R$${Payment.value} do mês de ${month} 
                está próxima de vencer (dia ${Payment.expiration}).
                </p>
                Agradecemos muito pela sua contribuição mensal e gostariamos de
                ressaltar o quanto ela ajuda a salvar muitos animais em situação de 
                risco e vulnerabilidade.
                </p>

                Atenciosamente, <strong>ONG Patas Amigas</strong>.
            </div> `;

        sendEmail(month, el.email, msg);
    });
}

async function sendEmail(month, email, msg) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
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
        console.log(error);
    }
}