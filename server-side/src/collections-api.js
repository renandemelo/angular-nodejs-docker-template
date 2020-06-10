const sendEmail = require('./sendEmail')
const model = require('./model')
const dateFormat = require('dateformat');
const constants = require('./constants')
const Collection = model.Collection
const Giving = model.Giving
const COLLECTION_PASSWORD = constants.COLLECTION_PASSWORD

const getCollections = async (req, res) => {
    try{
        const collections = await Collection.findAll({
            order: [['id', 'DESC']],
            include: [{
                model: Giving
            }]
        })
        res.json(collections)
    }catch(e){
        res.send({success: false, error: e.message})
    }
}

const getCollectionsCsv = async (req, res) => {
    const sendError = (message) => res.send({success: false, error: message})
    try{
        if(req.session.loggedIn){
            const collections = await Collection.findAll({
                order: [['id', 'DESC']],
                include: [{
                    model: Giving
                }]
            })
            const entries = []
            const labels = [
                'Collection Id',
                'Date',
                'Collector 1',
                'Collector 2',
                'Additional details',
                'Attendant count',
                'Person (Donor)',
                'Cause',
                'Currency',
                'Euro - amount in Bills',
                'Euro - amount - Coins',
                'Other currency - amount'
            ];
            for(collection of collections){
                const {id, date, collector1, collector2, 
                    additionalDetails, attendantCount} = collection;
                const formattedDate = dateFormat(date, "dd.mm.yyyy");
                const givings = await collection.getGivings()
                const collectionPart = [
                    id, 
                    formattedDate, 
                    collector1, 
                    collector2,
                    additionalDetails,
                    attendantCount,
                ];
                for(giving of givings){
                    const {person, cause, currency, amountInEuroBills,
                            amountInEuroCoins, amountInOtherCurrency} = giving;
                    const givingLine = [...collectionPart,
                        person, cause, currency, amountInEuroBills, 
                        amountInEuroCoins, amountInOtherCurrency];
                    entries.push(givingLine);
                }
            }
            res.csv([labels, ...entries]);
        } else {
            sendError('Not logged in!')
        }

    }catch(e){
        sendError(e.message)
    }
}

const getCollection = async (req, res) => {
    const id = req.params.id
    const sendError = (message) => res.send({success: false, error: message})
    try{
        if(req.session.loggedIn){
            const collections = await Collection.findOne({ 
                where: {id: id},  
                include: [{
                    model: Giving
                }]
            });
            res.json(collections);
        } else{
            sendError('Not logged in!')
        }
    }catch(e){
        sendError(e.message)
    }
}

  
const postCollections = (req, res) => {
    console.log(`Body: ${JSON.stringify(req.body)}`)
    const {givings, date, collector1, collector2, password
        , additionalDetails, attendantCount } = req.body
    const newCollectionToSave = {
        date, collector1, collector2,
        additionalDetails, attendantCount
    }
    const handleError = (message) => {
        res.send({success: false, error: message});
    }
    let collectionId = null
    if(password === COLLECTION_PASSWORD){
        Collection.create(newCollectionToSave)
        .then(savedCollection => {
            collectionId = savedCollection.id
            const givingsToSave = givings.map((giving) => {
                return { person: giving.person,  
                        cause: giving.cause,  
                        currency: giving.currency,
                        amountInEuroBills: giving.amountInEuroBills,
                        amountInEuroCoins: giving.amountInEuroCoins,
                        amountInOtherCurrency: giving.amountInOtherCurrency,
                        collectionId: savedCollection.id}
            })
            return Giving.bulkCreate(givingsToSave)
        })
        .then(() => Collection.findById(collectionId))
        .then((collection) => sendEmail(collection))
        .then(() => res.send({success: true}))
        .catch((e) => {
            console.error(e)
            handleError(`Error saving entities: ${e.message}`)
        })
    }else{
        handleError('Invalid collection password')
    }
}

const deleteCollection = (req,res) => {
    const id = req.params.id
    console.log(`Id to be deleted: ${id}`)
    const sendError = (message) => res.send({success: false, error: 'Not logged in!'})
    if(req.session.loggedIn){
        Collection.findByPk(id,{include: [{
            model: Giving
        }]})
        .then(collection => collection.destroy())
        .then(() => res.send({success: true}))
        .catch(e => sendError(e.message))
    }else{
        sendError('Not logged in!')
    }
}

module.exports = {
    getCollections: getCollections,
    getCollectionsCsv: getCollectionsCsv,
    getCollection: getCollection,
    postCollections: postCollections,
    deleteCollection: deleteCollection
}