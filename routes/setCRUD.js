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

    POST     /set/addCard/:set_id/:card_id  Body:N/A
    POST     /set/addNewCard/:set_id        Body:{front_text:String, back_text:String}
    `
    res.status(418).send(help)
})

/// .populate finds all the cards via their id.
/// "card_ids" is a one-to-many relationship with the card collection
/// ExampleSet = {set_name:"One", card_ids[1,2]}
/// will be populated to be
/// ExampleSet = {set_name:"One", card_ids[{_id:1, front_text:"front", back_text:"back"},{_id:2, front_text:"back", back_text:"front"}]}

router.get("/getAll", (req, res, error) => {
    // Get all sets. Populate the cards in them
    setModel.find({}).populate("card_ids").then( sets => {
        // Then Respond
        res.status(200).json(sets)
    }).catch(error)
 })

router.get("/getOne/:id", (req, res, error) => {
    // Find the set in the url, then respond
    setModel.findById(req.params.id).then( set => {
        // Populate the cards inside the set then respond
        set.populate("card_ids").then( populatedSet => {
            res.status(200).json(populatedSet)
        })
    }).catch(error)
 })

router.post("/create", (req, res, error) => {
    // Create set from using the request body, then respond
    setModel.create(req.body).then( set => {
        res.status(200).json(set)
    }).catch(error)
 })

router.patch("/update/:id", (req,res,error) => {
    // Find Set By ID in url
    setModel.findById(req.params.id).then( set => {
        // If set_name is in the request body, then update the set
        if (set.body.set_name){
            set.set_name = req.body.set_name
        }

        // If card_ids is in the request body, then update the set
        if (req.body.card_ids){
            set.card_ids = req.body.card_ids
        }

        // Save, populate the cards in the set, then respond
        set.populate("card_ids").save().then( setPopulated => {
            res.status(200).json(setPopulated)
        })
    }).catch(error)
})

router.post("/delete/:id", (req, res, error) => {
    // Find and delete set in the url
    setModel.findByIdAndDelete(req.params.id).then( set => {
        // Respond
        res.status(200).json(set)
    }).catch(error)
})

router.post("/addCard/:set_id/:card_id", (req, res, error) => {
    // Find set
    setModel.findById(req.params.set_id).then( set => {

        // Find card (to verify it exists)
        cardModel.findById(req.params.card_id).then( card => {
            
            // Check if it's already in set
            if (set.card_ids.indexOf(card._id) > -1){
                throw Error("Set Already has that card!")
            }

            // Add the card to set
            set.card_ids.push(card)

            // Save set, populate the cards, and then respond
            set.populate("card_ids").save().then( populatedSet => {
                res.status(200).json(populatedSet)
            })

        })

    }).catch(error)
})

router.post("/addNewCard/:id", (req, res, error) => {

    // Create new card
    cardModel.create(req.body).then( newCard => {
        setModel.findById(req.params.id).then(set => {
            // Add new card to set
            set.card_ids.push(newCard)

            // Save, populate the cards, and then respond
            set.save().populate("card_ids").then( populatedSet => {
                res.status(200).json(populatedSet)
            })
        })
    }).catch(error)

})

module.exports = router