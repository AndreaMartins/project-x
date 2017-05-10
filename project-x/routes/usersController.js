const express        = require('express');
const userController = express.Router();
const auth           = require("../helpers/auth");
const passport       = require("../helpers/passport");
const flash          = require("connect-flash");
const User           = require("../models/user");
const Item           = require("../models/item");


//public info page with all the users
userController.get("/", (req, res, next)=>{
  User.find({}, (err, users)=>{
    if(err) next(err);
    let usr = [];
    let route;
    for (let query in req.query){
      route = query;
    } if (route === "experts"){
      users.forEach((user)=>{
        if(user.role === "Professional") usr.push(user);
      });
      res.render("user/showexperts", {usr});
    } else {
      users.forEach((user)=>{
        if(user.role === "Owner") usr.push(user);
      });
      res.render("user/showowners", {usr});
      }
    });
});


//public info about an specific users -more details
userController.get('/:id', (req, res, next) => {
  User.findById(req.params.id, (err,user)=> {
    if (err) { next(err); }
    let items = [];
    user.itemsUser.forEach((item)=>{
      Item.findById(item,(err,itm)=>{
        if (err) next(err);
        // console.log(itm);
        items.push(itm);
        console.log(items);
      });
    });
    console.log("items",items);
    console.log("the user: " + user);
    res.render('user/showuser',{user: user});
  });
});

//user edit its own info
userController.post("/:id", auth.checkLoggedIn("/logout"), (req, res, next)=> {
  console.log(req.body.address);
  const userInfo = {
    firstName: req.body.name,
    lastName: req.body.lastName,
    email: req.body.email,
    address:{
      street: req.body.street,
      postCode: req.body.postCode,
      city: req.body.city,
      country: req.body.country,
      coordinates: [Number(req.body.lat), Number(req.body.lng)],
  }
  };
  User.findByIdAndUpdate(req.params.id, userInfo, (err, user) => {
    if (err) next(err);
    res.redirect("/dashboard");
  });
});

// check if is the user or admin dets the right to go to edit page
userController.get("/:id/edit", auth.checkLoggedIn("/logout"), (req, res, next)=> {
  User.find({"_id": req.params.id}, (err, users)=> {
    if(err) next(err);
    if(req.user._id == req.params.id || req.user.role == "Admin") {
      res.render("auth/edit-user", {user: users[0]});}
    else res.redirect("/logout");
  });
});

userController.get("/:id/expert", auth.checkLoggedIn("/logout"), (req, res, next)=> {
  User.find({"_id": req.params.id}, (err, users)=> {
    if(err) next(err);
    if(req.user._id == req.params.id || req.user.role == "Admin") {
      res.render("auth/becomexpert", {user: users[0]});}
    else res.redirect("/logout");
  });
});

userController.get('/:id/map',auth.checkLoggedIn("/logout"), (req, res, nect)=> {
  User.find({"role": "Professional"},{"_id": 0}, (err, experts)=>{
    if(err) next(err);
      // User.find({"_id": req.params.id}, (err, user)=>{
      res.render("user/expertsmap", {experts});
    // });
  });
});

module.exports = userController;
