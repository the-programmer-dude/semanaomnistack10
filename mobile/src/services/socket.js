import socketIO from 'socket.io-client'

const socket = socketIO('http://192.168.15.3:4848', {
    autoConnect: false
})

function subscribeToDevs(callbackFunction) {
    socket.on('send-data-to-client', callbackFunction)
}
function connect(latitude, longitude, techs) {
    socket.emit('send-information', {
        latitude,
        longitude,
        techs   
    })

    //socket.io.opts.query = {latitude, longitude, techs}
    socket.connect()
}

function disconnect() {
    if (socket.connected) socket.disconnect()
}

export {
    connect,
    disconnect,
    subscribeToDevs,
}