import express from "express";
import bodyParser from "body-parser";



const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


let storedTitle = "";
let storedText = "";

app.get("/", (req, res) =>{
  res.render("index.ejs");
});

app.get("/create", (req, res) =>{
    res.render("create-post.ejs");
});

function saveTitle(req, res, next){
    storedTitle = req.body["titlePost"];
    storedText = req.body["textPost"];
    next();
}

app.post("/", saveTitle, (req, res) =>{
    res.render("index.ejs", {
        titlePost: storedTitle,
        textPost: storedText,
    });
});

app.post("/create", (req, res) =>{
    const titlePost = req.body.titlePost || "";
    const textPost = req.body.textPost || "";
    res.render("create-post.ejs", { titlePost, textPost });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


