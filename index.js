/// Express API By Andrew McCall
// Imports
const mongoose = require("mongoose")
const express = require("express")
const config = require("./secret.json")

// Processing also known as "routes"
const server = express();

// Logging Middleware
server.use((req, res, next) => {
    console.log(`${new Date().getTime()} - IP[${req.ip}] URL[${req.url}]`);
    next();
})

// New Json Parsing Middleware.
// It literally uses body-parser, just packaged with express now
server.use(express.json())

// Routes
server.use("/set", require("./routes/setCRUD.js"))
server.use("/card", require("./routes/cardCRUD.js"))

// Connect to db, then Start accepting requests
mongoose.connect(config.MONGO_URL).then(() => {
    console.log("Connected to the MongoDB Server!")
    
    server.listen(config.API_PORT, () => {
        console.log("Started API!")
        console.log(`Listening on localhost:${config.API_PORT}`)
    })
})