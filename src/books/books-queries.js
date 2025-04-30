const getBooks = `
            SELECT b.id, b.title, b.author, b.description, c.file_path 
            FROM books b 
            LEFT JOIN covers c ON b.id = c.book_id
        `;

const getBook = `
            SELECT b.id, b.title, b.author, b.description, c.file_path
            FROM books b
            LEFT JOIN covers c ON b.id = c.book_id
            WHERE b.id = $1
`;

const postBook = `
      INSERT INTO books (title, author, description) 
      VALUES ($1, $2, $3) 
      RETURNING id;
`;
const postCover = `
    INSERT INTO covers (book_id, file_path) 
    VALUES ($1, $2)
 `;

export default {
    getBooks,
    getBook,
    postBook,
    postCover,
};

// module.exports = {
//   getBooks,
//   postBook,
// };
