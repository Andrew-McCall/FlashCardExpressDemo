const {Schema, model} = require("mongoose")

const cardSchema = new Schema({
    front_text:{type:String, required:true},
    back_text:{type:String, required:true}
})

const cardModel = model("Card", cardSchema)

module.exports = cardModel