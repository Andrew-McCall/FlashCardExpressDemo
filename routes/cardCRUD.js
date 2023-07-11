const router = require("express").Router()
const cardModel = require("./models/card.js")

router.get("/", (req, res) => {
    const help = 
    `Wrong Path!
    GET      /card/getAll            Body:N/A
    GET      /card/getOne/:card_id   Body:N/A
    POST     /card/create            Body:{front_text:String, back_text:String}
    patch      /card/update/:card_id Body:{front_text?:String, back_text?:String}
    DELETE   /card/delete/:card_id   Body:N/A
    `
    res.status(418).send(help)
})

router.get("/getAll", (req, res, error) => {
    // Find all then respond
    cardModel.find({}).then( cards => {
        res.status(200).json(cards)
    }).catch(error)
 })

router.get("/getOne/:id", (req, res, error) => {
    // Find the card in the url, then respond
    cardModel.findById(req.params.id).then( card => {
        res.status(200).json(card)
    }).catch(error)
 })

router.post("/create", (req, res, error) => {
    // Create card from body, then respond
    cardModel.create(req.body).then( card => {
        res.status(200).json(card)
    }).catch(error)
 })

router.patch("/update/:id", (req,res,error) => {
    // Find the card in url
    cardModel.findById(req.params.id).then( card => {
        // If the reqest body has front_text, update the card
        if (req.body.front_text){
            card.front_text = req.body.front_text
        }

        // If the reqest body has back_text, update the card
        if (req.body.back_text){
            card.back_text = req.body.back_text
        }

        // Save the card, then respond
        card.save().then(() => {
            res.status(200).json(card)
        })
    }).catch(error)
})

router.post("/delete/:id", (req, res, error) => {
    // Find and delete the card in the url, then respond
    cardModel.findByIdAndDelete(req.params.id).then( card => {
        res.status(200).json(card)
    }).catch(error)
})

module.exports = router