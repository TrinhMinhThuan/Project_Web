require('dotenv').config();
const express = require("express");
const { create } = require("express-handlebars");
const app = express();
const https = require('https');
const viewRoute = require('./routes/view_route');
const UserRoute = require('./routes/User_route');
const CategoriesRoute = require('./routes/Categories_route');
const session = require('express-session');
const bodyParser = require('body-parser');
const middle = require('./middleware/middleware');

app.use(session({
  secret: 'hhh', // Thay 'your-secret-key' bằng một chuỗi bí mật tùy chọn
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false } // Sử dụng 'true' nếu chỉ sử dụng qua HTTPS
}));
app.use(bodyParser.json());

const hbs = create({
  extname: '.hbs'
});
const PORT = process.env.MAIN_SERVER_PORT;
app.engine('hbs', hbs.engine)


app.set("view engine", "hbs"); 
app.set("views", "./views");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(middle.isLogin);

app.use("/", UserRoute);
app.use("/", viewRoute);
app.use("/", CategoriesRoute);

const server = https.createServer({
  key: process.env.KEY,
  cert: process.env.CERT
}, app);


server.listen(PORT, ()=> {
  console.log("Create https server on port: ", PORT); 
}) 
