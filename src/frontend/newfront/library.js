const collection = document.querySelector('.collection')
const addCard = document.querySelector('.add-card')
const overlay = document.getElementById('card-overlay')
overlay.addEventListener('click', handleOverlayClick)
const addOverlay = document.getElementById('add-overlay');
addOverlay.addEventListener('click', handleAddOverlayClick)
const bookForm = document.getElementById('bookForm')
bookForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", document.getElementById("add-title").value);
    formData.append("author", document.getElementById("add-author").value);
    formData.append("description", document.getElementById("add-description").value);
    formData.append("cover", document.getElementById("add-cover").files[0]);
    console.log(formData)

    const response = await fetch("http://localhost:3000/api/v1/books/upload", {
        method: "POST",
        body: formData,
    });

    const result = await response.json();
    alert(result.message);
})

var draggedElement = null

function handleDragStart(e) {
    this.style.opacity = 0.4
    draggedElement = this

    e.dataTransfer.setDragImage(this, 5, 5)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('item', this.innerHTML)
}

function handleDragOver(e) {
    console.log('dragover')
    e.preventDefault()

    e.dataTransfer.dropEffect = 'move'
    return false
}

function handleDragEnter(e) {
    console.log('dragenter')
    this.classList.add('dragover')
}

function handleDragLeave(e) {
    console.log('dragleave')
    this.classList.remove('dragover')
}

function handleDrop(e) {
    console.log('drop')
    
    if (draggedElement != this) {
        const parent = this.parentNode;

        if (parent === draggedElement.parentNode) {
            let nextSiblingOfDragged = draggedElement.nextSibling;

            if (nextSiblingOfDragged == this) {
                console.log('same')
                nextSiblingOfDragged = this.nextElementSibling
                parent.insertBefore(draggedElement, nextSiblingOfDragged)
            } else {
                parent.insertBefore(draggedElement, this);

                if (nextSiblingOfDragged) {
                    parent.insertBefore(this, nextSiblingOfDragged);
                } else {
                    parent.appendChild(this); 
                }
            }
        }
    }

}

function handleDragEnd(e) {
    console.log('dragend')
    this.style.opacity = '1'
    let cards = collection.querySelectorAll('.card:not(.add-card)')
    cards.forEach(card => {
        card.classList.remove('dragover')
    })
}

function handleBookClick(e) {
    console.log('book click')
    const overlayBook = document.getElementById('overlay-book')
    overlay.classList.add('active')
    overlayBook.classList.add('active')
    loadBook(this)
}

async function loadBook(bookElement) {
    const id = bookElement.dataset.id
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
    console.log(book.cover_url)
    bookCover.src = `${book.cover_url ? book.cover_url : '../../covers/no_cover.png'}`;
}

function handleOverlayClick(e) {
    if (e.target === this) {
        console.log('overlay click')
        const overlayBook = overlay.firstElementChild
        overlay.classList.remove('active')
        overlayBook.classList.remove('active')
    }
}

function handleAddOverlayClick(e) {
    if (e.target === this) {
        console.log('add overlay click')
        const addContainer = addOverlay.firstElementChild
        addOverlay.classList.remove('active')
        addContainer.classList.remove('active')
    }
}

async function loadBooks() {
    try {
        const response = await fetch('http://localhost:3000/api/v1/books/')
        const books = await response.json()
        books.books.forEach(book => {
            const newCard = document.createElement('div')
            newCard.classList.add('card')
            newCard.dataset.id = book.id;
            newCard.innerHTML = `
                ${book.cover_url ? `<img src="${book.cover_url}" alt="Обложка">` : book.title}
            `;
            newCard.draggable = true
            newCard.addEventListener('dragstart', handleDragStart)
            newCard.addEventListener('dragenter', handleDragEnter)
            newCard.addEventListener('dragover', handleDragOver)
            newCard.addEventListener('dragleave', handleDragLeave)
            newCard.addEventListener('drop', handleDrop)
            newCard.addEventListener('dragend', handleDragEnd)
            newCard.addEventListener('click', handleBookClick)
            collection.insertBefore(newCard, addCard)
        })
    } catch(error) {
        console.error('Ошибка загрузки книг: ', error)
    }
}

loadBooks()

addCard.addEventListener('click', () => {
    console.log('add card click')
    const addContainer = document.getElementById('add-container')
    addOverlay.classList.add('active')
    addContainer.classList.add('active')
    // loadBook(this)
    // const newCard = document.createElement('div')
    // newCard.classList.add('card')
    // newCard.style.backgroundColor = randomColor()
    // newCard.draggable = true
    // newCard.addEventListener('dragstart', handleDragStart)
    // newCard.addEventListener('dragenter', handleDragEnter)
    // newCard.addEventListener('dragover', handleDragOver)
    // newCard.addEventListener('dragleave', handleDragLeave)
    // newCard.addEventListener('dragend', handleDragEnd)
    // newCard.addEventListener('drop', handleDrop)
    // collection.insertBefore(newCard, addCard)
})

function randomColor() {
    let randomColor = `rgb(${Math.trunc(Math.random() * 256)},${Math.trunc(Math.random() * 256)},${Math.trunc(Math.random() * 256)})`
    return randomColor
}


