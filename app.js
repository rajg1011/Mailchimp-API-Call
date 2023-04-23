const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
require('dotenv').config(); // for .env  file
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
console.log(process.env);   // process.env give data in env ile
app.use(express.static("public")); //to add static files like css; also static files now relative to public folder=> u r now in public folder

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const fname = req.body.Fname;
  const lname = req.body.Lname;
  const email = req.body.email;
  const url = `https://us21.api.mailchimp.com/3.0/lists/${process.env.audience}`;
  console.log(url);
  const addData = {
    members: [
      // Look memebers need to be an array of objects and what we post to mailchimp server must be an JSON. So we make addData as object that have members array. Which then whole addData is an object. So can stringify it.
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };

  const JSONData = JSON.stringify(addData);

  const options = {
    method: "POST",
    auth: `raj:${process.env.api}`, // auth: "any string: API key"   From nodejs offcial site.
  };
  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      // console.log(response);
      if (response.statusCode == 200) {
        res.sendFile(__dirname + "/success.html");
      } else res.sendFile(__dirname + "/fail.html");
    });
  });
  request.write(JSONData);
  request.end();
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Server Is Started");
});
