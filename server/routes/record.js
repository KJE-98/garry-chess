const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This section will help you get a users information.
recordRoutes.route("/users").get(async function (req, res) {
    console.log(req.query.id);
    if ( req.query.id.length < 10 ){
      res.status(400).send("User_id is too short");
      return;
    }

    const dbConnect = dbo.getDb();

    dbConnect
      .collection("garry_chess_users")
      .find({ user_id : req.query.id }).limit(1)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching user!");
       } else {
          res.json(result);
        }
      });
  });

// This section will help you create a new user.
recordRoutes.route("/users/recordUser").post(function (req, res) {
    if ( req.body.id.length < 10 ){
      console.log( "sending user_id is too short, userid: " + req.body.id);
      res.status(400).send("User_id is too short");
      return;
    }

    const dbConnect = dbo.getDb();
    const userDocument = {
      user_id: req.body.id,
      books: [],
    };
  
    dbConnect
      .collection("garry_chess_users")
      .insertOne(userDocument, function (err, result) {
        if (err) {
          res.status(400).send("Error inserting matches!");
        } else {
          console.log(`Added a new user with id ${result.insertedId}`);
          res.status(204).send("OK");
        }
      });
  });

// This section will help you update a book.
recordRoutes.route("/users/addToBook").post(function (req, res) {
    if ( req.body.id.length < 10 ){
      res.status(400).send("User_id is too short");
      return;
    }
    console.log(req.body.bookName, req.body.id);
    const dbConnect = dbo.getDb();
    const listingQuery = { user_id: req.body.id };
    const updates = {
      $addToSet: {
        "books.$[book].positions": { $each: req.body.positions }
      },
    };
    const arrayFilters = {
      arrayFilters: [
        {"book.bookName" : req.body.bookName}
      ]
    }
  
    dbConnect
      .collection("garry_chess_users")
      .updateOne(listingQuery, updates, arrayFilters, function (err, _result) {
        if (err) {
          res.status(400).send(`Error updating likes on listing with id ${listingQuery.id}!`);
        } else {
          console.log("1 document updated");
          res.status(204).send("OK");
        }
      });
  });

// This section will help you delete a book.
recordRoutes.route("/deleteBook/:id/:bookName").delete((req, res) => {
    const dbConnect = dbo.getDb();
    console.log(req.params.id);
    console.log(req.params.bookName);
    const listingQuery = { user_id: req.params.id };
    updates = {
      $pull: { books: { bookName : req.params.bookName } }
    }

    dbConnect
      .collection("garry_chess_users")
      .updateOne(listingQuery, updates, function (err, _result) {
        if (err) {
          res.status(400).send(`Error deleting listing with id ${req.params.bookName}!`);
        } else {
          console.log("1 book deleted");
          res.status(204).send("OK");
        }
      });
  });

// This section will help you create a book.
recordRoutes.route("/createBook").post((req, res) => {
  if ( req.body.id.length < 10 || req.body.bookName.length < 1 ){
    res.status(400).send("User_id or bookname is too short");
    return;
  }
  const dbConnect = dbo.getDb();
  const listingQuery = { user_id: req.body.id };
  updates = {
    $addToSet: { books: { bookName: req.body.bookName, color: req.body.color, positions: [] } }
  }

  dbConnect
    .collection("garry_chess_users")
    .updateOne(listingQuery, updates, { upsert: false }, function (err, _result) {
      if (err) {
        res.status(400).send(`Error deleting listing with id ${listingQuery.listing_id}!`);
      } else {
        console.log("book created");
        res.status(204).send("OK");
      }
    });
});


module.exports = recordRoutes;