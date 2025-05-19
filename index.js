import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = process.env.APP_PORT;

// Init Database

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_URL,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true })); // Allows us to pass webpage information to the server
app.use(express.static("public")); // Allows use of static files with expressjs

/*
  This is the function to pull all the information from the server
  and push it to a list that the ejs files can read from to display
  it for us
*/

async function getList() {
  const result = await db.query("SELECT * FROM books ORDER BY id ASC");
  let books = [];
  result.rows.forEach((book) => {
    books.push(book);
  });
  return books;
}

// Initial call to display main page

app.get("/", async (req, res) => {
  const bookList = await getList();
  res.render("index.ejs", {
    bookItems: bookList,
  });
});

app.post("/add-book", async (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
