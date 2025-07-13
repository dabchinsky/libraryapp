import Sortable from 'sortablejs/modular/sortable.complete.esm.js';

const collection = document.getElementById('js-collection')
const addCard = document.querySelector('.js-add-card')
const overlay = document.getElementById('card-overlay')
const overlayBook = document.getElementById('overlay-book')
const addOverlay = document.getElementById('add-overlay');
const bookForm = document.getElementById('bookForm')
var draggedElement = null

overlay.addEventListener('click', handleOverlayClick)
addOverlay.addEventListener('click', handleAddOverlayClick)

loadBooks();

var sortable = Sortable.create(collection, {
    group: "sorting",
    sort: true,
    animation: 100,
    ghostClass: "card-ghost",
    swapThreshold: 0.3,
    filter: '.js-no-sort',
    onMove: function (evt) {
        if (evt.related.classList.contains('no-sort')) {
            return false;
        }
    },
    onEnd: reorderBooks,
})

async function reorderBooks(evt) {
    const ids = [...document.querySelectorAll('.js-card:not(.add-card)')].map(card => card.dataset.id)
        const response = await fetch('http://localhost:3000/api/v1/books/reorder', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ newOrder: ids })
        });

        const result = await response.json()
        console.log(result.message)
}

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
    if (result?.book?.id) {
        await loadBook(result.book.id)
        await reorderBooks();
    }
    console.log(result.book.id)
    alert(result.message);
})

addCard.addEventListener('click', () => {
    console.log('add card click')
    const addContainer = document.getElementById('add-container')
    addOverlay.classList.add('active')
    addContainer.classList.add('active')
})

function handleBookClick(e) {
    console.log('book click')
    overlay.classList.remove('invisible')
    overlay.classList.remove('opacity-0')
    overlayBook.classList.remove('invisible')
    overlayBook.classList.remove('opacity-0')
    loadBookOverlay(this)
}

async function loadBookOverlay(bookElement) {
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
    bookCover.src = `http://localhost:3000/api/v1/books/cover/${id}`;
}

function handleOverlayClick(e) {
    if (e.target === this) {
        console.log('overlay click')
        overlay.classList.add('invisible')
        overlay.classList.add('opacity-0')
        overlayBook.classList.add('invisible')
        overlayBook.classList.add('opacity-0')
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

function createNewCard(book) {
    const coverUrl = `http://localhost:3000/api/v1/books/cover/${book.id}`
    const newCard = document.createElement('div')
    // newCard.classList.add('card')
    newCard.className = 'js-card flex justify-center items-center border-1 border-black rounded-lg w-27 h-40 overflow-hidden cursor-pointer select-none hover:scale-103'
    newCard.dataset.id = book.id;
    newCard.innerHTML = `
        ${book.cover_url ? `<img src="${coverUrl}" class="w-full h-full" alt="Обложка">` : `<p class="w-full text-center">${book.title}</p>`}
    `;

    // OLD DND REALISATION
    // newCard.draggable = true
    // newCard.addEventListener('dragstart', handleDragStart)
    // newCard.addEventListener('dragenter', handleDragEnter)
    // newCard.addEventListener('dragover', handleDragOver)
    // newCard.addEventListener('dragleave', handleDragLeave)
    // newCard.addEventListener('drop', handleDrop)
    // newCard.addEventListener('dragend', handleDragEnd)

    newCard.addEventListener('click', handleBookClick)
    return newCard;
}

async function loadBook(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/books/${id}`)
        const book = await response.json()
        const newCard = createNewCard(book)
        collection.insertBefore(newCard, addCard)
    } catch(error) {
        console.error('Ошибка загрузки книги: ', error)
    }
}

async function loadBooks() {
    try {
        const response = await fetch('http://localhost:3000/api/v1/books/')
        const books = await response.json()
        const sortedBooksArray = books.books.sort((a, b) => a.position_number - b.position_number)
        sortedBooksArray.forEach(book => {
            const newCard = createNewCard(book)
            collection.insertBefore(newCard, addCard)
        })
    } catch(error) {
        console.error('Ошибка загрузки книг: ', error)
    }
}



// OLD DND REALISATION 

// function handleDragStart(e) {
//     this.style.opacity = 0.4
//     draggedElement = this

//     e.dataTransfer.setDragImage(this, 5, 5)
//     e.dataTransfer.effectAllowed = 'move'
//     e.dataTransfer.setData('item', this.innerHTML)
// }

// function handleDragOver(e) {
//     console.log('dragover')
//     e.preventDefault()

//     e.dataTransfer.dropEffect = 'move'
//     return false
// }

// function handleDragEnter(e) {
//     console.log('dragenter')
//     this.classList.add('dragover')
// }

// function handleDragLeave(e) {
//     console.log('dragleave')
//     this.classList.remove('dragover')
// }

// function handleDrop(e) {
//     console.log('drop')
    
//     if (draggedElement != this) {
//         const parent = this.parentNode;

//         if (parent === draggedElement.parentNode) {
//             let nextSiblingOfDragged = draggedElement.nextSibling;

//             if (nextSiblingOfDragged == this) {
//                 console.log('same')
//                 nextSiblingOfDragged = this.nextElementSibling
//                 parent.insertBefore(draggedElement, nextSiblingOfDragged)
//             } else {
//                 parent.insertBefore(draggedElement, this);

//                 if (nextSiblingOfDragged) {
//                     parent.insertBefore(this, nextSiblingOfDragged);
//                 } else {
//                     parent.appendChild(this); 
//                 }
//             }
//         }
//     }

// }

// function handleDragEnd(e) {
//     console.log('dragend')
//     this.style.opacity = '1'
//     let cards = collection.querySelectorAll('.card:not(.add-card)')
//     cards.forEach(card => {
//         card.classList.remove('dragover')
//     })
// }