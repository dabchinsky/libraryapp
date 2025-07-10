import Model from "./books-dao.js"

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


export default { getBooks, uploadBook, getBook, reorderBooks };
