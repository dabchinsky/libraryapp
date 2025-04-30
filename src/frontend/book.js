async function loadBook() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get("id");
    console.log(id);
    const response = await fetch(`http://localhost:3000/api/v1/books/${id}`);
    const book = await response.json();
    console.log(book);

    const bookTitle = document.getElementById("title");
    bookTitle.innerHTML = `${book.title}`;
    const bookAuthor = document.getElementById("author");
    bookAuthor.innerHTML = `${book.author}`;
    const bookDescription = document.getElementById("description");
    bookDescription.innerHTML = `${book.description}`;
    const bookCover = document.getElementById("cover");
    bookCover.src = `${book.cover_url}`;
}

loadBook();
