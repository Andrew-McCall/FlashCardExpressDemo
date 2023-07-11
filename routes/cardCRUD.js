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
    cardModel.find({}).then( cards => {
        res.status(200).json(cards)
    }).catch(error)
 })

router.get("/getOne/:id", (req, res, error) => {
    cardModel.findById(req.params.id).then( card => {
        res.status(200).json(card)
    }).catch(error)
 })

router.post("/create", (req, res, error) => {
    cardModel.create(req.body).then( card => {
        res.status(200).json(card)
    }).catch(error)
 })

router.patch("/update/:id", (req,res,error) => {
    cardModel.findById(req.params.id).then( card => {
        if (req.body.front_text){
            card.front_text = req.body.front_text
        }

        if (req.body.back_text){
            card.back_text = req.body.back_text
        }

        card.save().then(() => {
            res.status(200).json(card)
        })
    }).catch(error)
})

router.post("/delete/:id", (req, res, error) => {
    cardModel.findByIdAndDelete(req.params.id).then( card => {
        res.status(200).json(card)
    }).catch(error)
})

module.exports = router