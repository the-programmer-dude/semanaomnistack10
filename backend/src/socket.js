const socketIo = require('socket.io')
const parseStringAsArray = require('./utils/parseStringAsArray')
const calculateDistance = require('./utils/calculateDistance')
const connections = []

let io

exports.setUpSocketIO = (server) => {
    io = socketIo(server)

    io.on('connection', (sckt) => {
        console.log(sckt.id)
        //const { latitude, longitude, techs } = sckt.handshake.query
        sckt.on('send-information', (info) => {
            const { latitude, longitude, techs } = info
            connections.push({
                coordinates: {
                    latitude: Number(latitude),
                    longitude: Number(longitude)
                },
                techs: parseStringAsArray(techs),
                id: sckt.id
            })
        })
    })
}

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connect => {
        return calculateDistance(coordinates, connect.coordinates) < 50
        && connect.techs.some(tech => techs.includes(tech))
    })
}

exports.sendMessage = (to, message, data) => {
    to.forEach(element => {
       io.to(element.id).emit(message, data)
    })
}

exports.onDevDeleted = (msg) => {
    io.emit(msg)
}

//backend
    //const http = require('http')
    //const server = http.Server(app)
    //const functionblabla = require('./socket')
    //functionblabla(server) 
    //server.listen(4848)

    //const socketIO = require('socket.io')
    //export.functionblabla = (server) => {
    // const io = socketIO(server)
    // io.on('connection', (sckt) => {
    //  sckt.on('send-information', (info) => console.log(info)) 
    // })
    //}

//frontend mobile
    //import socketIO from 'socket.io-client'
    //const io = socketIO('http://192.168.15.3:4848', {autoConnect: false})
    //function connect(latitude, longitude, techs){ 
    // io.connect(); 
    // io.emit('send-information', {
    // latitude, longitude, techs
    //})
    //}
    //function disconnect() {
    // if(io.connected) io.disconnect()
    //}
    //export {connect, disconnect}

    //import { connect, disconnect } from './socket'
    //...
    //function blabla() {
    // ...
    //  websocket()
    //}
    //function websocket() {
    //    connect(latitude, longitude, techs)
    //}