const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.801m1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        const database = client.db("wonderlandRajshahi");
        const ridesCollection = database.collection("rides");
        const bookingsCollection = database.collection("bookings");

        app.get("/rides", async (req, res) => {
            const cursor = ridesCollection.find({});
            const rides = await cursor.toArray();
            res.send(rides);
        });

        app.get("/rides/:rideId", async (req, res) => {
            const id = req.params.rideId;
            const query = { _id: ObjectId(id) };
            const ride = await ridesCollection.findOne(query);
            res.send(ride);
        });

        app.get("/bookings/:email", async (req, res) => {
            const email = req.params.email;
            const filter = bookingsCollection.find({ email: email });
            const result = await filter.toArray();
            res.send(result);
        });

        app.post("/bookings", async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            console.log(result);
            res.send(result);
        });

        app.delete("/bookings/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.send(result);
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Wonderland server is running");
});

app.listen(port, () => {
    console.log("Wonderland server is running on port:", port);
});
