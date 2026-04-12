const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { setUser } = require("../service/auth");

function isApiRequest(req) {
  const acceptHeader = req.get("accept") || "";
  const requestedWith = req.get("x-requested-with") || "";
  return (
    acceptHeader.includes("application/json") ||
    requestedWith === "XMLHttpRequest"
  );
}

async function handleUserSignup(req, res) {
  //this function handles signup requests
  try {
    const { name, email, password } = req.body; //extract form data from frontend
    await User.create({
      //saves a new user into MongoDB and await-> wait till data is stored in Mongodb
      name,
      email,
      password,
    });

    if (isApiRequest(req)) {
      return res.status(201).json({
        success: true,
        message: "Account created successfully.",
        redirect: "/",
      });
    }

    return res.redirect("/"); //after successful signup browser is told to go to "/" or "homepage"
  } catch (error) {
    if (isApiRequest(req)) {
      return res.status(400).json({
        success: false,
        error: "Could not create account. Please try a different email.",
      });
    }

    return res.render("signup", {
      error: "Could not create account. Please try a different email.",
    });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
    password,
  });

  if (!user) {
    if (isApiRequest(req)) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    return res.render("login", {
      error: "Invalid  Username or Password ",
    });
  }

  // const sessionId = uuidv4(); NEEDED FOR STATEFUL BUT NOT IN STATELESS
  // setUser(sessionId,user);
  const token = setUser(user);
  // res.cookie("uid", sessionId); // making a cookie here with name "uid"and passing sessionId in it .
  // res.cookie("uid",token );
  // return res.redirect("/");
  res.cookie("token", token);
  // return res.json({token});

  if (isApiRequest(req)) {
    return res.status(200).json({
      success: true,
      message: "Signed in successfully.",
      redirect: "/",
    });
  }

  return res.redirect("/");
}

module.exports = { handleUserSignup, handleUserLogin };
