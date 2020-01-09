require('dotenv').config()
const express = require('express')
const app = express()

app.use(require('cors')())
app.use(express.json())

app.use('/sevenup', require('./controllers/sevenupController'))
app.use('/profile', require('./controllers/profileController'))

app.listen(process.env.PORT, () => console.log(`Server started at port ${process.env.PORT}`))