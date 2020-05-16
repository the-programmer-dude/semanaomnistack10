/*Params type:

Query: req.query, url: urlName/?name=value (dados para filtro, pesquisa, GET)
Route Params: req.params, url: urlName/urlParamName (dados para deletar objetos, DELETE) 
Body: req.body, url: NONE (dados para criar objetos e editar, PUT and POST)
*/

const express = require("express")
const mongoose = require("mongoose")
const cors = require('cors')
const http = require('http')
const { setUpSocketIO } = require('./socket')

const app = express()
const server = http.Server(app)
setUpSocketIO(server)

const routes = require("./routes")

mongoose.Promise = global.Promise
//Dont try to connect to my database, because i change the ip whitelist and the password
mongoose.connect("mongodb+srv://ROOT:ROOT@cluster0-awbmu.mongodb.net/week10?retryWrites=true&w=majority", 
{
    useNewUrlParser: true, 
    useUnifiedTopology: true
})

app.use(express.json())

app.use(cors())

app.use(routes)

server.listen(4848)
