import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv"

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false, 
  },
});



db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
  } else {
    console.log('Database connected successfully!');
  }
});

export default db;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


let posts = [];

app.get("/", async (req, res) =>{
  try{
    const getPosts = await db.query('SELECT * FROM posts ORDER BY id DESC');
    const posts = getPosts.rows;
    res.render("index.ejs", { posts });
  } catch (error) {
    console.error("Error at obt post:", error);
    res.status(500).send("Error at obt post.");
  }
});

app.get("/create", (req, res) =>{
    res.render("create-post.ejs", {
      id: null,
      titlePost: "",
      textPost: "",
    });
});

app.post("/", async (req, res) =>{
  const {titlePost, textPost} = req.body;

  try{
    await db.query(
      'INSERT INTO posts (title, content) VALUES ($1, $2)',
      [titlePost, textPost]);
      res.redirect("/");

  } catch (error) {
    confirm.error('Error at creating a post: ', error);
    res.status(500).send('Error at creating a post.');
  }
    posts.push ({
        titlePost: req.body.titlePost,
        textPost: req.body.textPost,
    });
    
});

app.post("/delete", async (req, res) =>{
  const {postId} = req.body;
  try{
    await db.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.redirect("/");
  } catch (error){
    console.error("Error at obt post:", error);
    res.status(500).send("Error at obt post");
  }
})

app.get("/edit/:id", async (req, res) => {
  const {id} = req.params;
  try{
    const result = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
    const post = result.rows[0];
    if (post) {
      res.render("create-post.ejs", {
        titlePost: post.title || '',
        textPost: post.content || '',
        id: post.id || null,
      });
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error){
    console.error("Error fetching post:", error);
    res.status(500).send("Error fetching post");
  }
});

app.post("/update/:id", async (req, res) =>{
  const {id} = req.params;
  const {titlePost, textPost} = req.body;
  try{
    await db.query(
      'UPDATE posts SET title = $1, content = $2 WHERE id = $3',
      [titlePost, textPost, id]
    );
    res.redirect('/');
  } catch (error){
    console.error("Error updating post:", error);
    res.status(500).send("Error updating post");
  }
});

app.listen(port,"0.0.0.0", () => {
  console.log(`Server running on port http://localhost:${port}`);
});


