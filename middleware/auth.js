const { getUser } = require("../service/auth");

function checkForAuthentication(req, res, next) {
  // const authorizationHeaderValue = req.headers["authorization"];
  const tokenCookie = req.cookies?.token ;

  req.user = null;
  if (
    !tokenCookie 
  )
    return next();

  // const token = authorizationHeaderValue.split("Bearer")[1];
  const token = tokenCookie;
  const user = getUser(token);

  req.user = user;
  return next();
}


function restrictTo(roles) {
  return function(req,res,next){
    if (!req.user) return res.redirect("/login");

    if(!roles.includes(req.user.role)) return res.end("UnAuthorized");

return next();
  };
}


// async function restrictToLoggedinUserOnly(req, res, next) {
//   // const userUid = req.cookies?.uid;  //request m koi cookie hai ky jiska naam uid ho
//   const userUid = req.headers["authorization"]; //ab cookie to aa nhi rha to ek header ayega Authorization naam se
//   // console.log(req.headers);

//   if (!userUid) return res.redirect("/login"); //agr uid nhi hai to y redirect kr dega login page pr
//   const token = userUid.split("Bearer")[1]; //"Bearer [23u1232ukhdjdh]"
//   const user = getUser(token); //pr agr uid hai to getuser pr validate krege

//   // const user = getUser(userUid);

//   if (!user) return res.redirect("/login");

//   req.user = user;
//   next();
// }

// async function checkAuth(req, res, next) {
//   // const userUid = req.cookies?.uid;
//   // const user = getUser(userUid);
// console.log(req.headers);
//   const userUid = req.headers["authorization"];

//   const token = userUid.split("Bearer")[1];

//   const user = getUser(token);

//   req.user = user;
//    next();
// }


// module.exports = { restrictToLoggedinUserOnly, checkAuth };
module.exports = {
    checkForAuthentication,
    restrictTo
}
