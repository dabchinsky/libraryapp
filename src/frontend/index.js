async function loadBooks() {
    try {
        const response = await fetch("http://localhost:3000/api/v1/books");
        const books = await response.json();
        const booksContainer = document.getElementById("books");
        booksContainer.innerHTML = "";

        books.books.forEach((book) => {
            const bookElement = document.createElement("div");
            bookElement.classList.add("book");
            bookElement.dataset.id = book.id;
            bookElement.innerHTML = `
                <h3>${book.title}</h3>
                <p><strong>Автор:</strong> ${book.author || "Неизвестен"}</p>
                <p>${book.description || "Без описания"}</p>
                ${book.cover_url ? `<img src="${book.cover_url}" alt="Обложка">` : ""}
            `;
            booksContainer.appendChild(bookElement);

            bookElement.addEventListener("click", function () {
                window.location.href = `./book.html?id=${this.dataset.id}`;
            });
        });
    } catch (error) {
        console.error("Ошибка загрузки книг:", error);
    }
}

loadBooks();

document.getElementById("bookForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", document.getElementById("title").value);
    formData.append("author", document.getElementById("author").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("cover", document.getElementById("cover").files[0]);

    const response = await fetch("http://localhost:3000/api/v1/books/upload", {
        method: "POST",
        body: formData,
    });

    const result = await response.json();
    alert(result.message);
});
