//FOR STATEFUL WE DID THIS AS WE NEED TO MAINTAIN STATE 
//WHEN A USER LOGS IN , REMEMBER WHO THEY ARE USING A SESSION ID , AND LATER USE THAT SESSION ID TO IDENTIFY THE USER.
//THIS IS CALLED SESSION MANAGEMENT 

// const sessionIdToUserMap = new Map(); //key -> sessionID , value -> user object

// function setUser(id,user){
//     sessionIdToUserMap.set(id,user)  //this sessin ID belongs to this user 
// }

// function getUser(id){

//     return sessionIdToUserMap.get(id);
// }

// module.exports = {
//     setUser , 
//     getUser ,
// }




//FOR STATELESS WE DONT NEED A STATE 
const jwt = require("jsonwebtoken");
const secret = "Piyush$123@$"

function setUser(user){        //this function is used to create token and user isused as payload  
    return jwt.sign({ //whenever i will sign in , i will use a secret key 
        _id: user._id,
        email:user.email,
        role: user.role,
        }, secret
    );
}

// function getUser(uid){
function getUser(token){
    if (!token) return null;
    try{
return jwt.verify(token,secret);    //verifying the secret key  
    // return sessionIdToUserMap.get(id);
    } catch(error){
        return null;
}
}

module.exports = {
    setUser , 
    getUser ,
 }