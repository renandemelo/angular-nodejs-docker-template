const nodemailer = require("nodemailer");
const dateFormat = require('dateformat');
const constants = require('./constants')

const SMTP_SERVER = constants.SMTP_SERVER
const SMTP_PORT = constants.SMTP_PORT
const SMTP_SENDER = constants.SMTP_SENDER
const SMTP_PASSWORD = constants.SMTP_PASSWORD
const SMTP_RECIPIENTS = constants.SMTP_RECIPIENTS

async function sendEmail(collection){
    let transporter = nodemailer.createTransport({
        host: SMTP_SERVER,
        port: SMTP_PORT,
        secure: false, 
        auth: {
        user: SMTP_SENDER,
        pass: SMTP_PASSWORD
        }
    });

    const { id, date, collector1, collector2, 
        attendantCount, additionalDetails } = collection

    const formattedDate = dateFormat(date, "dd.mm.yyyy");
    const givings = await collection.getGivings()
    const money = (n) => !!n ? `&euro; ${n.toFixed(2)}` : ''
    const givingRows = givings.map(g => `<tr>
                                            <td>${g.person? g.person : ''}</td>
                                            <td>${g.cause}</td>
                                            <td>${g.currency}</td>
                                            <td>${money(g.amountInEuroBills)}</td>
                                            <td>${money(g.amountInEuroCoins)}</td>
                                            <td>${g.amountInOtherCurrency? g.amountInOtherCurrency : ''}</td>
                                            </tr>`).join('')
    
                                            
    const givingsTable = `  <table>
                                <tr>
                                    <th>Person</th>
                                    <th>Cause</th>
                                    <th>Currency</th>
                                    <th>Euro Bills</th>
                                    <th>Euro Coins</th>
                                    <th>Other Currency</th>
                                </tr>
                                ${givingRows}
                            </table>`

    
    const causes = Array.from(new Set(givings.map(g => g.cause)))
    const euroGivings = givings.filter(g => g.currency === 'EURO')
    console.log(`Euro givings: ${JSON.stringify(euroGivings)}`)
    const perCauseTotalizer = (totals, giving) => {
        const cause = giving.cause
        if(!totals[cause]){
            totals[cause] = {bills: 0, coins: 0}
        }
        totals[cause].bills += giving.amountInEuroBills
        totals[cause].coins += giving.amountInEuroCoins
        return totals
    }
    const totalsPerCause = euroGivings.reduce(perCauseTotalizer, {})
    console.log(`Totals per cause: ${JSON.stringify(totalsPerCause)}`)
    const causesWithTotal = causes.filter(c => totalsPerCause[c]);
    const causesRows = causesWithTotal.map(cause => `<tr>
        <td>${cause}</td>
        <td>${money(totalsPerCause[cause].bills)}</td>
        <td>${money(totalsPerCause[cause].coins)}</td>
        </tr>`).join('')

    const causesTable = `<table>
                        <tr>
                        <th>Cause</th>
                        <th>Euro Bills</th>
                        <th>Euro Coins</th>
                        </tr>
                        ${causesRows}
                        </table>`

    const subject = `Offering # ${id} - ${formattedDate}`
    const content = `<html>
                    <body>
                    <h2>${subject}</h2>
                        <table>
                        <tr><td>Date</td> <td>${formattedDate}</td></tr>
                        <tr><td>Collector 1</td> <td>${collector1}</td></tr>
                        <tr><td>Collector 2</td> <td>${collector2}</td></tr>
                        <tr><td>Attendant count</td> <td>${attendantCount || ''}</td></tr>
                        <tr><td>Additional details</td> <td>${additionalDetails || ''}</td></tr>
                        </table>
                        <h3>Total Euro per Cause</h3>
                        ${causesTable}
                        <h3>All givings</h3>
                        ${givingsTable}
                    </body>
                    </html>`

    let info = await transporter.sendMail({
        from: SMTP_SENDER,
        to: SMTP_RECIPIENTS,
        subject: subject,
        html: content
    });

    console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail