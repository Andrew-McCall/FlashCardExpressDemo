const {Schema, model, Types} = require("mongoose")

const setSchema = new Schema({
    set_name:{type:String, required:true},
    card_ids:[{type: Types.ObjectId, ref:"Card"}] // Array of Card Ids
})

const setModel = model("Set", setSchema)

module.exports = setModel 