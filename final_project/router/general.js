const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// TASK 6
public_users.post("/register", (req,res) => {
  // get username and password from the request body
  const uname = req.body.username;
  const pwd = req.body.password;

  // check if both values are provided
  if (uname && pwd){
    // check it the user already exists
    if (!isValid(uname)) {
      //add user
      users.push({
        "username": uname,
        "password": pwd
      });
      return res.status(200).json({message: "User successfully created. Welcome!"});
    }else{
      return res.status(404).json({message: "User already exists."});
    }
  }else{
    return res.status(404).json({message: "Please submit a username and password!"});
  }

});

// TASK 1 
// TASK 10: Promise callback
// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // TASK 10:
  // create promise
  let returnBookListPromise = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, 4));
  })

  // call promise function
  returnBookListPromise.then(
    (success_val) => {return res.status(200).send(success_val)}
  )

  /* TASK 1:
  // return books
  // return res.status(200).send(JSON.stringify(books, null, 4));*/
});

// TASK 2
// TASK 11: + Promise callback
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn_req = req.params.isbn;

  //TASK 11: Promise
  // create promise
  let returnBookFromISBN = new Promise((resolve, reject) => {
    if(books[isbn_req]){
      resolve(JSON.stringify(books[isbn_req], null, 4));
    }else{
      reject("ISBN does not exist!");
    } 
  })

  // call promise function
  returnBookFromISBN.then(
    (success) => {return res.status(200).send(success)},
    (err) => {return res.status(400).send(err)}
  )

  /*TASK 2
  if(books[isbn_req]){
    return res.status(200).send(JSON.stringify(books[isbn_req], null, 4));
  }else{
    return res.status(400).send("ISBN does not exist!");
  } */ 
});
  
// TASK 3
// TASK 12: Promise
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author_req = req.params.author;

  // create promise
  let returnBookFromAuthor = new Promise((resolve, reject) => {
    let book_list = Object.entries(books);
    let filtered_list = book_list.filter((id) => id[1].author === author_req);
    if(filtered_list.length>0){
      resolve(filtered_list);
    }else{
      reject("Author not found!");
    } 
  })

  // call promise function
  returnBookFromAuthor.then(
    (success) => {return res.status(200).send(success)},
    (err) => {return res.status(400).send(err)}
  )

  /*TASK 3
  let book_list = Object.entries(books);
  let filtered_list = book_list.filter((id) => id[1].author === author_req);

  // return the filtered list
  if(filtered_list){
    return res.status(200).send(filtered_list);
  }else{
    return res.status(400).send("Author not found!");
  }*/
});

// TASK 4
// TASK 13: Promises
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title_req = req.params.title;

  //TASK 13:
  let returnBookFromTitle = new Promise((resolve, reject) => {
    let book_list = Object.entries(books);
    let filtered_list = [];

    // different approach: manual filtering
    book_list.forEach(([isbn, entry]) => {
      if (entry.title == title_req){
        filtered_list.push([isbn, entry]);
      }
    });

    if(filtered_list.length>0){
      resolve(filtered_list);
    }else{
      reject("Book title not found!");
    }
  })

  returnBookFromTitle.then(
    (success) => {return res.status(200).send(success)},
    (err) => {return res.status(400).send(err)}
  )

  /*TASK 4 
  let book_list = Object.entries(books);
  let filtered_list = [];

  // different approach: manual filtering
  book_list.forEach(([isbn, entry]) => {
    if (entry.title == title_req){
      filtered_list.push([isbn, entry]);
    }
  });
  console.log(filtered_list);

  // return the filtered list
  if(filtered_list){
    return res.status(200).send(filtered_list);
  }else{
    return res.status(400).send("Book title not found!");
  }*/
});

// TASK 5
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn_req = req.params.isbn;

  if(books[isbn_req] && books[isbn_req].reviews){
    console.log(books[isbn_req].reviews);
    return res.status(200).send(books[isbn_req].reviews);
  }else{
    return res.status(400).send("Book or review not found!");
  }
});

module.exports.general = public_users;
