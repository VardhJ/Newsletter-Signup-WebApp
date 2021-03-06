const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https")
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
//for local files:
app.use(express.static("public"));


app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  //mailchimp:
  const data ={
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us20.api.mailchimp.com/3.0/lists/280e5782ba";

  var myKey = process.env.API_KEY;
  const options = {
    method: "POST",
    auth: "vardh:"+ myKey,
  };
  console.log(options.auth);
  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});


app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});


//API Key: ef66cc29e0d0aacb1f5b043707d614a4-us20
//Audience ID: 280e5782ba
