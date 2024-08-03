const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check if the username is valid
let filtered_list = users.filter((user) => user.username === username);

  console.log(filtered_list)

  if(filtered_list.length > 0){
    return true;
  }else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

// TASK 7
//only registered users can login
regd_users.post("/login", (req,res) => {
  // get username and password from the request body
  const uname = req.body.username;
  const pwd = req.body.password;

  // check if both values are provided
  if (uname && pwd){
    // check if the user is authenticated
    if(authenticatedUser(uname, pwd)){
      // generate JWT token
      let accessToken = jwt.sign({data: pwd}, "access", {expiresIn: 60*60});

      req.session.authorization = {
          accessToken, uname
      }

      return res.status(200).json({message: "User successfully logged in!"});
    } else {
      return res.status(208).json({message: "Username or password incorrect!"});
    }
  }else{
    return res.status(404).json({message: "Please submit a username and password!"});
  }

});

// TASK 8
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // get requested isbn
  const isbn_req = req.params.isbn;

  // get new review -> in request query
  const new_review = req.query.review;

  // get username -> from session
  const uname = req.session.authorization.uname;

  // check if user has already posted a review -> update review
  // add new review if user has not posted a review yet
  let review_list = Object.entries(books[isbn_req].reviews); // get list of reviews
  let filtered_list = review_list.filter((review) => review[0] === uname); // filter list to check if the user already left a review
  
  books[isbn_req].reviews[uname] = new_review; // add or update the review
  console.log(books[isbn_req].reviews);

  if (filtered_list.length>0){
    return res.status(200).json({
      message: "Review has been updated",
      reviews: books[isbn_req].reviews
    });
  }else{
    return res.status(200).json({
      message: "New review has been added",
      reviews: books[isbn_req].reviews
    });
  }
});

// TASK 9
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn_req = req.params.isbn;

  const uname = req.session.authorization.uname;

  delete books[isbn_req].reviews[uname];

  res.status(200).json({
    message: "Review successfully deleted",
    reviews: books[isbn_req].reviews
  })

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
