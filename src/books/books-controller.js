import pool from "../../db.js";
import queries from "./books-queries.js";
import Model from "../../seq.js"

async function getBooks(req, res) {
    const resultSeq = await Model.Book.findAll();
    const books = resultSeq.map(book => book.toJSON())
    console.log(books)
    const resultSeqWithCovers = await Model.Book.findAll({
        include:[{
            model: Model.BookCover,
            as: 'covers',
            attributes: ['file_path'],
        }]
    });
    let booksWithCovers = resultSeqWithCovers.map(book => book.toJSON());
    booksWithCovers = booksWithCovers.map(book => {
        return {
            id: book.id,
            title: book.title,
            author: book.author,
            description: book.description,
            published_year: book.published_year,
            cover_url: book.covers.length > 0 ? `../../covers/${book.covers[0].file_path}` : null,
        }
    }) 
    console.log(booksWithCovers)
    res.json({ books: booksWithCovers });
}

async function getBook(req, res) {
    let id = req.params.id;
    const result = await getBookQuery(id);
    if (result === "error") return res.status(500).send("Database error");
    if (result === undefined) return res.status(500).send("undefined");
    const book = result.rows[0];
    res.json({
        ...book,
        cover_url: book.file_path ? `../../covers/${book.file_path}` : null,
    });
}

const uploadBook = async (req, res) => {
    const { title, author, description } = req.body;
    const file_path = req.files["cover"] ? req.files["cover"][0].filename : null;
    console.log(file_path);
    const result = await uploadBookQuery(title, author, description, file_path);
    if (result === "error") return res.status(500).send("Database error");
    if (result === undefined) return res.status(500).send("undefined");
    res.json({ message: "Книга и обложка добавлены", cover: result.rows[0] });
};

const getBooksQuery = async () => {
    try {
        const result = await pool.query(queries.getBooks);
        return result;
    } catch (error) {
        return "error";
    }
};

async function getBookQuery(id) {
    try {
        const result = await pool.query(queries.getBook, [id]);
        return result;
    } catch (error) {
        console.log(error);
        return "error";
    }
}

const uploadBookQuery = async (title, author, description, file_path) => {
    try {
        if (file_path) {
            const id = await pool.query(queries.postBook, [title, author, description]);
            const result = await pool.query(queries.postCover, [id, file_path]);
            return result;
        }
        const result = await pool.query(queries.postBook, [title, author, description]);
        return result;
    } catch (error) {
        console.log(error);
        return "error";
    }
};

export default { getBooks, uploadBook, getBook };
