module.exports = function parseStringAsArray(stringValue){
    return stringValue.split(",").map(element => element.trim())
}