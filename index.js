const express = require("express");
var cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());
var ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pas4h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("citytours");
    const packagesList = database.collection("citytours_packages_list");
    const blogslist = database.collection("citytours_blogs");
    const serviceslist = database.collection("citytours_services");
    const teammemberlist = database.collection("citytours_team");
    const guiderlist = database.collection("citytours_guider");
    const bookinglist = database.collection("citytours_booking_list");

    //Get All packages List
    app.get("/packageslist", async (req, res) => {
      const cursor = packagesList.find({});
      if ((await cursor.count()) === 0) {
        console.log("No documents found!");
      }
      const result = await cursor.toArray();
      res.json(result);
    });

    //Get All Blogs List
    app.get("/blogs", async (req, res) => {
      const cursor = blogslist.find({});
      if ((await cursor.count()) === 0) {
        console.log("No documents found!");
      }
      const result = await cursor.toArray();
      res.json(result);
    });

    //Get All Services List
    app.get("/serviceslist", async (req, res) => {
      const cursor = serviceslist.find({});
      if ((await cursor.count()) === 0) {
        console.log("No documents found!");
      }
      const result = await cursor.toArray();
      res.json(result);
    });

    //Get All Team members List
    app.get("/team-memberlist", async (req, res) => {
      const cursor = teammemberlist.find({});
      if ((await cursor.count()) === 0) {
        console.log("No documents found!");
      }
      const result = await cursor.toArray();
      res.json(result);
    });
    //Get All Services List
    app.get("/guiderlist", async (req, res) => {
      const cursor = guiderlist.find({});
      if ((await cursor.count()) === 0) {
        console.log("No documents found!");
      }
      const result = await cursor.toArray();
      res.json(result);
    });

    //Bookings
    app.post("/bookings", async (req, res) => {
      const bookings_details = req.body;
      const result = await bookinglist.insertOne(bookings_details);
      res.json(result);
    });

    //Get All booking List
    app.get("/bookings", async (req, res) => {
      const cursor = bookinglist.find({});
      if ((await cursor.count()) === 0) {
        console.log("No documents found!");
      }
      const result = await cursor.toArray();
      res.json(result);
    });

    //Get Single Package Details
    app.get("/package/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await packagesList.findOne(query);
      res.json(result);
    });

    //Get User Booking List
    app.get("/my-bookings/:id", async (req, res) => {
      const uid = [req.params.id];
      const query = { uid: { $in: uid } };
      const result = await bookinglist.find(query).toArray();
      res.json(result);
    });

    //Cancel Booking
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookinglist.deleteOne(query);
      res.json(result);
    });

    //update booking status
    app.put("/update-booking-status/:id", async (req, res) => {
      const id = req.params.id;
      const packages = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: packages.status,
        },
      };
      const result = await bookinglist.updateOne(query, updateDoc, options);
      res.json(result);
    });

    //Get Single Package Details
    app.get("/bookinglist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookinglist.findOne(query);
      res.json(result);
    });

    //Insert new package
    app.post("/addnewpackage", async (req, res) => {
      const new_package_details = req.body;
      const result = await packagesList.insertOne(new_package_details);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("City Tours Server Running");
});

app.listen(port, () => {
  console.log(`Running:${port}`);
});
