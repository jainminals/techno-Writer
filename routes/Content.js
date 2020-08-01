const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require("../helper/authHelper");
const Content = require("../Models/Content");

// router.get("/newsfeed", ensureAuthenticated, (req, res) => {
//   console.log(req.user);
//   res.render("newsfeed/index");
// });

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("content/index", {
    user: req.user,
  });
});
router.post("/addContent", ensureAuthenticated, (req, res) => {
  let error = [];
  if (!req.body.title) {
    console.log("enter Title");
    error.push({ text: "Enter the Title!!" });
  }

  if (!req.body.status) {
    console.log("enter Story");
    error.push({ text: "Select type of Story!!" });
  }
  if (!req.body.body) {
    console.log("enter description");
    error.push({ text: "Enter the description !!" });
  }
  if (error.length > 0) {
    console.log(req.body.status);
    console.log(req.body.title);
    res.render("content/index", {
      image: req.body.image,
      status: req.body.status,
      title: req.body.title,
      description: req.body.body,
      error,
    });
  } else {
    console.log(req.user._id);
    let allowComments;

    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }
    const newContent = new Content({
      userId: req.user._id,
      name: req.user.name,
      image: req.body.image,
      status: req.body.status,
      title: req.body.title,
      description: req.body.body,
      commentAllowance: allowComments,
    });
    const content = new Content(newContent);
    content
      .save()
      .then((data) => {
        res.redirect("/newsfeed");
       
      })
      .catch((err) => console.log(err));
  }
});

router.get("/newsfeed", ensureAuthenticated, (req, res) => {
  Content.find({ status: "public" })
    .populate("user")
    .sort({ createdAt: "desc" })
    .then((data) => {
      console.log(req.user);
      res.render("newsfeed/index", {
        content: data,
        user: req.user,
      });
    });
});

router.get("/newsfeed/public",  (req, res) => {
  const content = Content.find({ status: "public" })
    .populate("user")
    .sort({ createdAt: "desc" })
    .then((data) => {
      res.render("newsfeed/publc", {
        content: data,
        
      });
    });
});

router.get("/content/public/:id", (req, res) => {
  Content.findOne({ _id: req.params.id })
    .then((data) => {
      console.log(data)
      res.render("content/fullContent", {
        content: data,
        user:req.user
      });
     
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/content/:id", ensureAuthenticated, (req, res) => {
  Content.findOne({ _id: req.params.id })
    .then((data) => {
      console.log(data)
      res.render("content/fullContent", {
        content: data,
        user: req.user,
      });
     
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/content/edit/:id", ensureAuthenticated, (req, res) => {
  Content.findOne({ _id: req.params.id })
    .then((data) => {
      res.render("content/edit", {
        content: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/content/save/:id", ensureAuthenticated, (req, res) => {
  Content.findOne({ _id: req.params.id })
    .then((data) => {
      let allowComments;

      if (req.body.allowComments) {
        allowComments = true;
      } else {
        allowComments = false;
      }
      data.title = req.body.title;
      data.description = req.body.body;
      data.status = req.body.status;
      data.commentAllowance = req.body.allowComments;
      data
        .save()
        .then((data) => {
         
          res.redirect("/newsfeed");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/content/delete/:id", ensureAuthenticated, (req, res) => {
  Content.remove({ _id: req.params.id })
    .then(() => {
      res.redirect("/newsfeed");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/comment/:id", ensureAuthenticated, (req, res) => {
  Content.findOne({ _id: req.params.id })
    .populate("user")
    .then((data) => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id,
      };

      // Add to comments array
      data.comments.unshift(newComment);

      data
        .save()
        .then((data) => {
         
          res.redirect("/newsfeed");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
