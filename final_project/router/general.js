const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// TASK 1
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  return res.status(200).send(JSON.stringify(books, null, 4));
});

// TASK 2
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn_req = req.params.isbn;

  if(books[isbn_req]){
    return res.status(200).send(JSON.stringify(books[isbn_req], null, 4));
  }else{
    return res.status(400).send("ISBN does not exist!");
  }  
 });
  
// TASK 3
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author_req = req.params.author;

  //console.log(Object.entries(books))
  let book_list = Object.entries(books);
  let new_list = [];
  // Option 1: manual filtering
  /*book_list.forEach(([isbn, entry]) => {
    if (entry.author == author_req){
      new_list.push(entry);
    }
  });
  console.log(new_list);*/

  // Option 2: using .filter()
  let filtered_list = book_list.filter((id) => id[1].author === author_req);
  //console.log(filtered_list)

  // return the filtered list
  if(filtered_list){
    //return res.status(200).send(JSON.stringify(filtered_list, null, 4));
    return res.status(200).send(filtered_list);
  }else{
    return res.status(400).send("Author not found!");
  }
});

// TASK 4
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title_req = req.params.title;

  //console.log(Object.entries(books))
  let book_list = Object.entries(books);
  let filtered_list = [];
  // Option 1: manual filtering
  book_list.forEach(([isbn, entry]) => {
    if (entry.title == title_req){
      filtered_list.push([isbn, entry]);
    }
  });
  console.log(filtered_list);


  // return the filtered list
  if(filtered_list){
    //return res.status(200).send(JSON.stringify(filtered_list, null, 4));
    return res.status(200).send(filtered_list);
  }else{
    return res.status(400).send("Book title not found!");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
