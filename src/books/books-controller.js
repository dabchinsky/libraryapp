import pool from "../../db.js";
import Model from "./books-dao.js"

async function getBooks(req, res) {
    const resultSeqWithCovers = await Model.Book.findAll({
        include:[{
            model: Model.BookCover,
            as: 'covers',
            attributes: ['file_path'],
        }]
    });
    const booksWithCovers = resultSeqWithCovers.map(book => {
        const bookJson = book.toJSON()
        return {
            id: bookJson.id,
            title: bookJson.title,
            author: bookJson.author,
            description: bookJson.description,
            published_year: bookJson.published_year,
            cover_url: bookJson.covers.length > 0 ? `../../covers/${book.covers[0].file_path}` : null,
        }
    });
    res.json({ books: booksWithCovers });
}

async function getBook(req, res) {
    const id = req.params.id;
    const resultSeq = await Model.Book.findByPk(id, {
        include: [{
            model: Model.BookCover,
            as: 'covers',
            attributes: ['file_path']
        }]
    });
    const resultSeqJson = resultSeq.toJSON()
    const bookWithCover = {
            id: resultSeqJson.id,
            title: resultSeqJson.title,
            author: resultSeqJson.author,
            description: resultSeqJson.description,
            published_year: resultSeqJson.published_year,
            cover_url: resultSeqJson.covers.length > 0 ? `../../covers/${resultSeqJson.covers[0].file_path}` : null,
        }
    res.json({ ...bookWithCover })
}

const uploadBook = async (req, res) => {
    const { title, author, description } = req.body;
    const file_path = req.files["cover"] ? req.files["cover"][0].filename : null;
    console.log(file_path);
    const book = await Model.Book.create({
        title,
        author,
        description,
    })
    if (file_path) {
            await Model.BookCover.create({
            book_id: book.id,
            file_path: file_path,
        })
    }
    res.json({ message: "Книга и обложка добавлены"});
};



export default { getBooks, uploadBook, getBook };
