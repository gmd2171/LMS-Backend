const jwt= require('jsonwebtoken');



//Verification
function verify (req , resp ,next){
    const authheader =req.headers.token;
    if(authheader){
        const token = authheader.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY,(err,user)=>{
            if(err) resp.status(403).send("Token is not valid");
            console.log(user);
            req.user=user;
            next()
        })
    }
    else{
        return resp.status(404).send("you might not be verified");
    }

}

module.exports=verify;