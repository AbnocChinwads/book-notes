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

let books = [];

async function getList() {
  const result = await db.query("SELECT book_review FROM reviews JOIN books ON books.id = reviews.id");
  books = result.rows;
  return books;
}

// Initial call to display main page

app.get("/", async (req, res) => {
  const reviewList = await getList();
  res.render("index.ejs", {
    bookItems: books,
  });
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });