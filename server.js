const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const moment = require('moment')
const methodOverride = require("method-override");

const PORT = 5000 || null;
const passport = require("passport");
const cookieParser = require("cookie-parser");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");


app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
app.use(methodOverride('_method'));

app.engine(
  "handlebars",
  exphbs({
    helpers: {
      stripTags(OriginalString) {
        return OriginalString.replace(/<(?:.|\n)*?>/gm, "");
      },
      getShortComment(comment) {
        if (comment.length < 64) {
          return comment;
        }
        return comment.substring(0, 61) + "...";
      },
      editIcon(storyUser, loggedUser, storyId, floating = true) {
        if (storyUser.toString() === loggedUser._id.toString()) {
          if (floating) {
            return `<a href="/content/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
          } else {
            return ''
          }
        } else {
          return ''
        }
      },
      formatDate(date, format) {
        return moment(date).utc().format(format)
      },
    },
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);


const { mongoURI } = require("./config/keys");
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));

app.set("view engine", "handlebars");

//

app.use(express.static(path.join(__dirname, "public")));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());



app.get("/", (req, res) => {
  res.render("unAuthenticated/login");
});

app.use(cookieParser());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());


require("./config/passport")(passport);

const Auth = require("./routes/Auth");
const Content = require("./routes/Content");
const Profile = require("./routes/Profile");

app.use("/", Auth, Content, Profile);

app.listen(PORT, () => console.log(`Server listen on PORT ${PORT}`));
