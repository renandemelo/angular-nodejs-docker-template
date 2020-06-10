var proxy = require('express-http-proxy');
 
const collectionsApi = require('./collections-api')
const loginApi = require('./login-api')
const constants = require('./constants')

const initRoutes = (app) => {
    app.get('/', (req, res) =>{
      res.redirect('/pages')
    })
    app.get('/api/logged', loginApi.loggedIn)
    app.post('/api/login', loginApi.login)
    
    app.get('/api/collections', collectionsApi.getCollections)
    app.get('/api/collections.csv', collectionsApi.getCollectionsCsv)
    app.get('/api/collections/:id', collectionsApi.getCollection)
    app.post('/api/collections', collectionsApi.postCollections)
    app.delete('/api/collections/:id', collectionsApi.deleteCollection)
  
    if(constants.ENVIRONMENT === 'DEVELOPMENT'){
      console.log('IN DEVELOPMENT MODE! Defining proxy to angular client server')
      app.use('/pages', proxy('client-side:4200', {
        proxyReqPathResolver: function(req) {
          console.log(`req.url: ${req.url}`);
          return `/pages/${req.url}`
        }
      }))
    } else{
      console.log('IN PRODUCTION MODE! Assuming already built angular project')
      app.get('/pages/**', (req,res) =>{
        res.sendFile('/usr/server-side/pages/index.html');
      })
    }
}
module.exports = initRoutes