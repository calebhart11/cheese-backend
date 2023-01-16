require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")

const {PORT = 3000, DATABASE_URL } = process.env

const app = express()

mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true

})

mongoose.connection
.on("open", () => console.log("you are connected to mongoose"))
.on("close", () => console.log("you have disconnected from mongoose"))
.on("error", (error) => console.log(error))

const CheeseSchema = new mongoose.Schema ({
    name: String,
    image: String,
    type: String,
});

const Cheese = mongoose.model("Cheese", CheeseSchema)

// MIDDLEWARE
app.use(cors());
app.use(morgan("dev"))
app.use(express.json())

//Routes

app.get("/", (req, res) => {
    res.send("Are You Alive?")
})

app.get("/cheeses", async (req,res) => {
    try{
        res.json(await Cheese.find({}));
    }catch(error){
        res.status(400).json(error)
    }
})

app.post("/cheeses", async (req, res) => {
    try{
        res.json(await Cheese.create(req.body))
    }catch(error){
        res.status(400).json(error)
    }
})

app.put("/cheeses/:id", async (req, res) => {
    try{
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    }catch(error){
        res.status(400).json(error)
    }
})

app.delete("/cheeses/:id", async (req, res) => {
    try{
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    }catch(error){
            res.status(400).json(error)
        }
    })

    app.get("/cheeses/:id", async (req, res) => {
        try{
            res.json(await Cheese.findById(req.params.id))
        }catch(error){
            res.status(400).json(error)
        }
    })

app.listen(PORT, () => console.log(`I am listening on Port: ${PORT}`))