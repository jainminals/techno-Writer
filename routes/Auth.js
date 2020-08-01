const express = require("express");
const router = express.Router();
const passport = require("passport");
const {ensureAuthenticated ,ensureGuest} =require('../helper/authHelper')


router.get("/",ensureGuest, (req, res) => {
  res.render("unAuthenticated/login");
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect(`/profile/${req.user._id}`);
  }
);


router.get('/verify',(req,res)=>{
  if(req.user){
    console.log(req.user)
  }else{
    console.log('no user')
  }
})

router.get("/logout", ensureAuthenticated,(req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
