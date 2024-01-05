const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));
app.set("view engine", "ejs");

let weather =null;
let q="";
let tempC =null;
let tempF ="";
let localTime ="";
let lastTimeUpdated ="";
let description ="";
let icon="";


app.get("/", function (req, res) {
  res.render("index", {
    query : q,
    Temp_c : tempC,
    Temp_f : tempF,
    Time : localTime ,
    Description : description,
    LastUpdate : lastTimeUpdated,
    Weather : weather,
    icon: icon,
  });
});

app.post("/", function (req, res) {
   q = req.body.search;
  const url =
    "https://api.weatherapi.com/v1/current.json?key=59e9b5a62de54ee5a05201807232412&q=" +
    q +
    "&aqi=no";

  https.get(url, function (response) {
    response.on("data", function (data) {
      try {
         weather = JSON.parse(data);
         console.log(weather);
         tempC = weather.current.temp_c;
         tempF = weather.current.temp_f;
         localTime = weather.location.localtime;
         lastTimeUpdated = weather.current.last_updated;
         description = weather.current.condition.text;
         icon = weather.current.condition.icon
      
        res.redirect("/");
      } catch (error) {
        res.sendFile(__dirname+"/error.html");
      }
    });
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
