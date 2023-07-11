const router = require("express").Router()
const setModel = require("./models/set.js")
const cardModel = require("./models/card.js")

router.get("/", (req, res) => {
    const help = 
    `Wrong Path!
    GET      /set/getAll                    Body:N/A
    GET      /set/getOne/:set_id            Body:N/A
    POST     /set/create                    Body:{set_name:String}
    PATCH    /set/update/:set_id            Body:{set_name:String, card_ids:[ ObjectIds ]}
    DELETE   /set/delete/:set_id            Body:N/A

    POST     /set/AddCard/:set_id/:card_id  Body:N/A
    POST     /set/AddCards/:set_id          Body:{card_ids:[ ObjectIds ]}
    `
    res.status(418).send(help)
})

/// .populate finds all the cards via their id.
/// "card_ids" is a one-to-many relationship with the card collection

router.get("/getAll", (req, res, error) => {
    setModel.find({}).populate("card_ids").then( sets => {
        res.status(200).json(sets)
    }).catch(error)
 })

router.get("/getOne/:id", (req, res, error) => {
    setModel.findById(req.params.id).populate("card_ids").then( set => {
        res.status(200).json(set)
    }).catch(error)
 })

router.post("/create", (req, res, error) => {
    // Create set from body
    setModel.create(req.body).then( set => {
        res.status(200).json(set)
    }).catch(error)
 })

router.patch("/update/:id", (req,res,error) => {
    // Find Set By ID
    setModel.findById(req.params.id).then( set => {
        // If set_name is in the body, update
        if (set.body.set_name){
            set.set_name = req.body.set_name
        }

        // If card_ids is in the body, update
        if (req.body.card_ids){
            set.card_ids = req.body.card_ids
        }

        // Save then respond
        set.save().populate("card_ids").then( setPopulated => {
            res.status(200).json(setPopulated)
        })
    }).catch(error)
})

router.post("/delete/:id", (req, res, error) => {
    // Find and delete set
    setModel.findByIdAndDelete(req.params.id).then( set => {
        // Delete all cards in that set
        cardModel.deleteMany({_id:{$in:set.card_ids}}).then(() => {
            // Respond
            res.status(200).json(set)
        })
    }).catch(error)
})

module.exports = router