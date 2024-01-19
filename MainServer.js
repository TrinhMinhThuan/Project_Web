const express = require("express");
const { create } = require("express-handlebars");
const app = express();

const viewRoute = require('./routes/view_route');
const UserRoute = require('./routes/User_route');
const hbs = create({
  extname: '.hbs'
});

app.engine('hbs', hbs.engine)


app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static("public"));

app.get("/", (req,res,next) =>{
  res.render("searchCategories", {
    title: "Quản lý danh mục",
  });
});

app.get("/searchCategories", (req,res,next) =>{
  res.render("searchCategories", {
    title: "Quản lý danh mục",
  });
});

app.get("/addCategories", (req,res,next) =>{
  res.render("addCategories", {
    title: "Quản lý danh mục",
  });
});

app.get("/addBook", (req,res,next) =>{
  res.render("addBook", {
    title: "Thêm danh mục",
  });
});

app.use(express.urlencoded({ extended: true }));
app.use("/", viewRoute);
app.use("/", UserRoute);


app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
