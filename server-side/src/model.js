
const Sequelize = require('sequelize')
const sequelize = new Sequelize('offerings_db', 'devuser', 'devpass', {
    host: 'dbserver',
    dialect: 'mysql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

const Giving = sequelize.define('givings', {
    person: {
        type: Sequelize.STRING
    },
    cause : {
        type: Sequelize.STRING
    }, 
    currency: {
        type: Sequelize.STRING
    },
    amountInEuroBills: {
        type: Sequelize.FLOAT
    },
    amountInEuroCoins: {
        type: Sequelize.FLOAT
    },
    amountInOtherCurrency: {
        type: Sequelize.STRING
    },
})
  
const Collection = sequelize.define('collections', {
    date: {
        type: Sequelize.DATE
    },
    collector1: {
        type: Sequelize.STRING
    },
    collector2: {
        type: Sequelize.STRING
    },
    additionalDetails: {
        type: Sequelize.STRING
    },
    attendantCount: {
        type: Sequelize.FLOAT    
    }
})
  
Collection.hasMany(Giving)
Giving.belongsTo(Collection)

function syncTables(){
    console.log('Trying to Sync Tables now!!')
    Collection.sync()
    .then(() => Giving.sync({alter: true}))
    .then(() => Collection.sync({alter: true}))
    .then(() => {
        console.log("Table sync successful!")
    })
    .catch((e) =>{
        console.error("Problem in table sync! ", e)
        console.log('Trying again in 60 seconds')
        setTimeout(syncTables, 60 * 1000)
    })
}

sequelize
.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
    syncTables();
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
})

module.exports = {
    Giving: Giving,
    Collection: Collection
}