const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'test'
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI

if (!connectionString) {
  console.error('Recuerda que tienes que tener un archivo .env con las variables de entorno definidas y el MONGO_DB_URI que servirá de conection string. Se usa Mongo DB Atlas para este desarrollo (Copiado de midudev)')
}

mongoose.connect(connectionString)
  .then(() => console.log('Database connected'))
  .catch(err => console.error(err))

process.on('uncaughtException', (error) => {
  console.error(error)
  mongoose.disconnect()
})
