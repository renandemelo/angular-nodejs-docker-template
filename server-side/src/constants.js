const logVariables = (variables) => {
    console.log('------ Variables ------')
    variables.forEach((v) => console.log(`${v}: ${process.env[v]}`))
}
logVariables(['ENVIRONMENT', 
            'ADMIN_PASSWORD', 
            'COLLECTION_PASSWORD', 
            'SMTP_SERVER', 
            'SMTP_PORT', 
            'SMTP_SENDER', 
            'SMTP_RECIPIENTS',
            'SMTP_PASSWORD'])

module.exports = {
    ENVIRONMENT: process.env.ENVIRONMENT,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    COLLECTION_PASSWORD: process.env.COLLECTION_PASSWORD,
    SMTP_SERVER: process.env.SMTP_SERVER,
    SMTP_PORT: parseInt(process.env.SMTP_PORT),
    SMTP_SENDER: process.env.SMTP_SENDER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_RECIPIENTS: process.env.SMTP_RECIPIENTS
}
