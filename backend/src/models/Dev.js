const mongoose = require("mongoose")
const pointSchema = require("./utils/pointSchema")

const schema = mongoose.Schema

const devSchema = new schema({
    name: String,
    github_username: String,
    bio: String,
    avatar_url: String,
    techs: [String],
    location : {
        type: pointSchema,
        index: '2dsphere'
    }
})

module.exports = mongoose.model('Dev', devSchema)