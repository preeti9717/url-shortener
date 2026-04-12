const express = require("express"); //express ko require kra
const path = require("path");
const cookieParser = require('cookie-parser')
const { connectToMongoDB } = require("./connect");
// const {restrictToLoggedinUserOnly , checkAuth} = require('./middleware/auth')
const {checkForAuthentication, restrictTo} = require("./middleware/auth")
const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require('./routes/user')
const rateLimit = require("express-rate-limit");

const app = express(); // ek application create kra
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);


const urlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // limit each IP
  message: "Too many requests, try again later"
});

// app.use("/url", restrictToLoggedinUserOnly, urlRoute);
// app.use("/", checkAuth, staticRoute);
app.use("/url", urlLimiter, restrictTo(["NORMAL","ADMIN"]), urlRoute);
app.use("/user" ,  userRoute);
app.use("/", staticRoute);

app.get("/url/:shortId",urlLimiter, async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});
app.listen(PORT, () => console.log(`Server started at ${PORT}`));
