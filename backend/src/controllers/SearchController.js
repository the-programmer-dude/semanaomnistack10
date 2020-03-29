const parseStringAsArray = require("../utils/parseStringAsArray")
const Dev = require("../models/Dev")

const { onDevDeleted } = require('../socket')

//index => when you want to show a list of things
//show => when you want to show just one
//store => when you want to create
//update => when you want to update something
//destroy => when you want to destroy something

module.exports = {
    async index(req, res){
        const { latitude, longitude, techs } = req.query

        const techsArray = parseStringAsArray(techs)

        const devFilter = await Dev.find({
            techs: {
                $in: techsArray
            },
            location: {
                $near: { 
                    $geometry: { type: "Point", coordinates: [ latitude, longitude ]},
                    $maxDistance: 50000,
                    $minDistance: 0
                }
            }
        })

        return res.json({ devFilter })
    },

    /*async show(req, res){
        const { latitude, longitude, techs } = req.query

        const techArray = parseStringAsArray(techs)

        const findOneDev = await Dev.findOne({
            techs: {
                $in: techArray
            },
            location: {
                $near: { 
                    $geometry: { type: "Point", coordinates: [ longitude, latitude ]},
                    $maxDistance: 0
                }
            }
        })
        

        return res.json({ findOneDev })
    }*/

    /*async update(req, res) {
        const { techs, latitude, longitude, username, name, avatar_url, requestedUsername, bio } = req.body

        const techArray = parseStringAsArray(techs)

        const findDev = await Dev.findOne({ github_username : name })

        if(findDev && !findDev == []){
            findDev = await Dev.findOneAndUpdate({
                github_username : requestedUsername
            }, {
                techs : techArray,
                location: {
                    type: "Point",
                    coordinates: [latitude, longitude]
                },
                github_username: username,
                avatar_url,
                bio,
                name
            })
        }

        return res.json({ findDev })
    },*/

    async destroy(req, res) {
        const { github_username } = req.params

        const findDevAndDelete = await Dev.findOneAndDelete({
            github_username
        })
        onDevDeleted('dev-deleted')
        return res.json({ findDevAndDelete })
    }
}