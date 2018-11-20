const sql = require('mssql')
//const config = require('config');
const winston = require('winston');
 
//  var config = 
//    {
//      user: 'dbadmin', // update me
//      password: 'Espl@123', // update me 
//      server: 'einterceptor.database.windows.net', // update me
//      database: 'EInterceptor',
//      options: 
//         { 
//              encrypt: true
//            , trustedConnection: true
//         },
//       sentimentApiUrl: 'https://pythonsentimentapplication.azurewebsites.net/sentiment'
//    }; 

  var config = 
   {
     user: 'sa', // update me
     password: 'espl@123', // update me 
     server: '192.168.101.20', // update me
     database: 'EInterceptor',
     options: 
        { 
             encrypt: true
           , trustedConnection: true
        },
      sentimentApiUrl: 'http://localhost:5000/'
   }; 


const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        winston.info('Connected to database successfully.')
        return pool
    })
    .catch(err => winston.error('Database Connection Failed!', err))

module.exports = {
    sql, poolPromise
}
