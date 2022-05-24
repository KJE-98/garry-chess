const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This section will help you get a list of all the documents.
recordRoutes.route("/listings").get(async function (req, res) {
    const dbConnect = dbo.getDb();
  
    dbConnect
      .collection("listingsAndReviews")
      .find({}).limit(50)
      .toArray(function (err, result) {
        if (err) {
          res.status(400).send("Error fetching listings!");
       } else {
          res.json(result);
        }
      });
  });

// I think we can delete this function above ^^^, I cant think of a use for it

// This section will help you create a new user.
recordRoutes.route("/users/recordUser").post(function (req, res) {
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
          res.status(204).send();
        }
      });
  });

// This section will help you update a book.
recordRoutes.route("/users/addToBook").post(function (req, res) {
    const dbConnect = dbo.getDb();
    const listingQuery = { user_id: req.body.id };
    const updates = {
      $addToSet: {
        "books.$[book].positions": req.body.positions
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
        }
      });
  });

// This section will help you delete a book.
recordRoutes.route("/listings/deleteBook").post((req, res) => {
    const dbConnect = dbo.getDb();
    const listingQuery = { user_id: req.body.id };
    updates = {
      $pull: { books: { bookName : req.body.bookName } }
    }

    dbConnect
      .collection("garry_chess_users")
      .updateOne(listingQuery, updates, function (err, _result) {
        if (err) {
          res.status(400).send(`Error deleting listing with id ${listingQuery.listing_id}!`);
        } else {
          console.log("1 document deleted");
        }
      });
  });

// This section will help you create a book.
recordRoutes.route("/listings/createBook").post((req, res) => {
  const dbConnect = dbo.getDb();
  const listingQuery = { user_id: req.body.id };
  updates = {
    $addToSet: { books: { bookName: req.body.bookName, positions: [] } }
  }

  dbConnect
    .collection("garry_chess_users")
    .updateOne(listingQuery, updates, function (err, _result) {
      if (err) {
        res.status(400).send(`Error deleting listing with id ${listingQuery.listing_id}!`);
      } else {
        console.log("1 document deleted");
      }
    });
});