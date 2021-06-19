const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('reviews'));
app.use(fileUpload());

const port = process.env.PORT || 5555;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2g0i6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.get('/', (req, res) => {
    res.send('yes, update password done...')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const bookServiceCollection = client.db("helpingHand").collection("bookService");
    const reviewCollection = client.db("helpingHand").collection("review");
    const adminCollection = client.db("helpingHand").collection("admin");
    const serviceCollection = client.db("helpingHand").collection("service")

    // delete single service
    app.delete('/delete/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        console.log("server Deleting this id: ", id);
        serviceCollection.findOneAndDelete({ _id: id })
            .then(documents => {
                res.send(documents);
                //console.log("Delete Success");
            })
    })


    // read all services in home
    app.get('/services', (req, res) => {
        serviceCollection.find()
            .toArray((err, items) => {
                //console.log(items);
                console.log("Hi akhi, I am from Services....");
                res.send(items)
            })
    })


    // post add Book Service
    app.post('/addBookService', (req, res) => {
        const newBookService = req.body;
        console.log('adding new book service: ', newBookService)
        bookServiceCollection.insertOne(newBookService)
            .then(result => {
                //console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    // read all services for specific user
    app.get('/bookingServiceList', (req, res) => {
        //console.log(req.query.email);
        bookServiceCollection.find({ email: req.query.email })
            .toArray((err, items) => {
                // console.log("User all orders: ",items);
                res.send(items)
            })
    })


    // read all book services for admin
    app.get('/allServiceList', (req, res) => {
        bookServiceCollection.find({})
            .toArray((err, items) => {
                console.log("Showing all order status for admin: ", items);
                res.send(items)
            })
    })


    // read all services for admin
    app.get('/allService', (req, res) => {
        serviceCollection.find({})
            .toArray((err, items) => {
                console.log("Showing all service for admin: ", items);
                res.send(items)
            })
    })


    // post add admin
    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        console.log('adding new Product: ', newAdmin)
        adminCollection.insertOne(newAdmin)
            .then(result => {
                //console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    // post add service
    app.post('/addService', (req, res) => {
        const newService = req.body;
        console.log('adding new Service: ', newService)
        serviceCollection.insertOne(newService)
            .then(result => {
                //console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })


    // app.post('/addReview', (req, res) => {
    //     const file = req.files.file;
    //     const name = req.body.name;
    //     const country = req.body.country;
    //     const email = req.body.email;
    //     const reviewDescription = req.body.reviewDescription;
    //     //const newImg = file.data;
    //     console.log(file, name, country, email, reviewDescription);
    //     const filePath = `${__dirname}/reviews/${file.name}`;
    //     file.mv(filePath, err => {
    //         if (err) {
    //             console.log(err);
    //             res.status(500).send({ msg: 'Failed to upload image...' })
    //         }
    //         const newImg = fs.readFileSync(filePath);
    //         const encImg = newImg.toString('base64');

    //         var image = {
    //             contentType: file.mimetype,
    //             size: file.size,
    //             img: Buffer.from(encImg, 'base64')
    //         };

    //         reviewCollection.insertOne({ name, country, email, reviewDescription, image })
    //             .then(result => {
    //                 fs.remove(filePath, error => {
    //                     if (error) {
    //                         console.log(error);
    //                         res.status(500).send({ msg: 'Failed to upload image...' });
    //                     }
    //                     res.send(result.insertedCount > 0);
    //                 })
    //             })
    //     })
    // })

    // post add review
    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        console.log('adding new Review: ', newReview)
        reviewCollection.insertOne(newReview)
            .then(result => {
                //console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })


    // read all reviews in homepage
    app.get('/allReview', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
                console.log("sending.......");
            })
    });

    // read all admins in homepage
    app.get('/allAdmin', (req, res) => {
        adminCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
                console.log("sending.......");
            })
    });

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})