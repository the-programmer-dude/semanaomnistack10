const axios = require("axios")
const Dev = require("../models/Dev")

const parseStringAsArray = require("../utils/parseStringAsArray")
const { findConnections, sendMessage } = require('../socket')

//index => when you want to show a list of things
//show => when you want to show just one
//store => when you want to create
//update => when you want to update something
//destroy => when you want to destroy something

module.exports = {
    async index(req, res) {
        const allDevs = await Dev.find({});

        return res.json(allDevs)
    },
    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body

        let dev = await Dev.findOne({ github_username })
        if(!dev) {
            const response = await axios.get(`https://api.github.com/users/${github_username}`)
            if(!response) return res.json({ message: "This user don't exist " })

            let { name, avatar_url, bio } = response.data
            if(!name) name = response.data.login

            const techArray = parseStringAsArray(techs)

            const location = {
                type: 'Point',
                coordinates: [latitude, longitude]
            }

            dev = await Dev.create({
                github_username,
                techs : techArray,
                name,
                avatar_url,
                bio,
                location
            })

            const socketResponse = findConnections(
                {latitude, longitude}, 
                techArray
            )

            sendMessage(socketResponse, 'send-data-to-client', dev)
        }

        return res.json(dev)
    }
}