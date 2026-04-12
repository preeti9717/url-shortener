//THESE ROUTES ARE RESPONSIBLE ONLY FOR SHOWING PAGES(UI).
//THEY FETCH DATA IF NEEDED AND REMDER VIEWS, BUT THEY DO NOT CHANGE DATA.

const express = require("express");
const URL = require("../models/url"); //used to fetch URLs from the database
const router = express.Router(); //mini express app
const {restrictTo} = require("../middleware/auth");

router.get('/admin/urls', restrictTo(['ADMIN']),async (req, res) => {    //agr vo admin hai to saare urls le aao
    const allurls = await URL.find({}); // if(!req.user) return res.redirect('/login')
    return res.render("home", {
      urls: allurls, //fetch all short URLs from DB
    });
  }
);
                        
router.get( "/", restrictTo(["NORMAL","ADMIN"]), async (req, res) => {
    const allurls = await URL.find({ createdBy: req.user._id }); // if(!req.user) return res.redirect('/login')
    return res.render("home", {
      urls: allurls, //fetch all short URLs from DB
    });
  }
);

router.get("/signup", (req, res) => {
  return res.render("Signup");
});

router.get("/login", (req, res) => {
  return res.render("Login");
});

module.exports = router;
