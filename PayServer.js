require('dotenv').config();
const express = require("express");
const { create } = require("express-handlebars");
const app = express();
const https = require('https');

const hbs = create({
  extname: '.hbs'
});
const PORT = process.env.PAY_SERVER_PORT;
app.engine('hbs', hbs.engine)


app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("public"));



app.use(express.urlencoded({ extended: true }));


const server = https.createServer({
  key: process.env.KEY,
  cert: process.env.CERT
}, app);


server.listen(PORT, ()=> {
  console.log("Create https server on port: ", PORT); 
}) 
