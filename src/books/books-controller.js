import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import Model from "./books-dao.js"

const imagesDir = '/Users/mac/Documents/libraryapp/src/covers/'

async function getCover(req, res) {
    const bookId = req.params.id
    const book = await Model.Book.findOne({ where: { id: bookId } })
    const cover = await book.getCovers();
    
    let imagePath;
    let ext;
    if (cover.length > 0) {
        imagePath = path.join(imagesDir, cover[0].file_path)
        ext = path.extname(cover[0].file_path).toLowerCase();
    } else {
        imagePath = path.join(imagesDir, 'no_cover.png')
        ext = '.png'
    }
    const ContentType = `image/${ext.slice(1)}`
    console.log(imagePath)
    console.log(ext)
    console.log(ContentType)
    res.setHeader('Content-Type', ContentType)
    res.sendFile(imagePath, (error) => {
        if (error) {
            console.error('Error sending file:', error);
            res.status(500).send('Error sending image.');
        }
    })
}

async function getBooks(req, res) {
    const resultSeqWithCovers = await Model.Book.findAll({
        include:{
            model: Model.BookCover,
            as: 'covers',
            attributes: ['file_path'],
        }
    });
    const booksWithCovers = resultSeqWithCovers.map(book => {
        const { covers, ...bookDetails} = book.toJSON()
        return {
            ...bookDetails,
            cover_url: covers.length > 0 ? `../covers/${covers[0].file_path}` : null,
        }
    });
    res.json({ books: booksWithCovers });
}

async function getBook(req, res) {
    const id = req.params.id;
    const resultSeq = await Model.Book.findByPk(id, {
        include: {
            model: Model.BookCover,
            as: 'covers',
            attributes: ['file_path']
        }
    });
    const { covers, ...bookDetails } = resultSeq.toJSON()
    const bookWithCover = {
            ...bookDetails,
            cover_url: covers.length > 0 ? `../covers/${covers[0].file_path}` : null,
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
    res.json({ message: "Книга и обложка добавлены", book: book.toJSON() });
};

async function reorderBooks(req, res) {
    const ids = req.body.newOrder;
    console.log(ids)

    await ids.forEach((id, index) => {
        Model.Book.update(
            { position_number: index},
            {
                where: {
                    id: id
                }
            }
        );
    });

    res.json({ message: "позиции обновлены" })
}


export default { getBooks, uploadBook, getBook, reorderBooks, getCover };
