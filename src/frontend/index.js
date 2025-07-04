let user1 = {
    name: 'Jason',
    age: 30,
    car: 'Jigul'
}

let user2 = {}

let user3 = user1

for (let key in user1) {
    user2[key] = user1[key]
}

console.log(user3 === user1)
console.log(user2 === user1)

//////////////

const collection = document.querySelector('.collection')
const addCard = document.querySelector('.add-card')

const resetButton = document.querySelector('.reset')
resetButton.addEventListener('click', () => {
    let firstElementChild = collection.firstElementChild;
    console.log(firstElementChild)
    while (firstElementChild.nextElementSibling) {
        console.log(firstElementChild.nextElementSibling)
        collection.removeChild(firstElementChild.nextElementSibling)
    }
})

const boxesButton = document.querySelector('.boxes') 
boxesButton.addEventListener('click', () => {
    const cards = [...collection.querySelectorAll('.card:not(.add-card)')]
    cards.forEach(card => {
        console.log(card.getBoundingClientRect())
    })
})

addCard.addEventListener('click', () => {
    const newCard = document.createElement('div')
    newCard.classList.add('card')
    newCard.style.backgroundColor = randomColor()
    newCard.draggable = true
    newCard.addEventListener('dragstart', () => {
        console.log('drag start')
        newCard.classList.add('dragging')
    })
    newCard.addEventListener('dragend', () => {
        newCard.classList.remove('dragging')
        collection.querySelectorAll('.nearest').forEach(card => card.classList.remove('nearest'))
    })
    collection.appendChild(newCard)
})

collection.addEventListener('dragover', (event) => {
    event.preventDefault()
    const cards = [...collection.querySelectorAll('.card:not(.add-card):not(.dragging)')]
    const draggingCard = document.querySelector('.dragging')
    cards.forEach(card => {
        card.classList.remove('nearest')
    })
    const nearest = findNearest(event.clientX, event.clientY, cards)
    if (nearest.nearestLeftCard == null) {
        console.log('nearest left null')
        if (nearest.nearestCard.nextElementSibling) {
            console.log('nearest have sibling')
            collection.insertBefore(draggingCard, nearest.nearestCard.nextElementSibling)
        } else {
            console.log('nearest doesnt have sibling')
            collection.appendChild(draggingCard)
        }
    } else {
        console.log('nearest left not null')
        nearest.nearestLeftCard.classList.add('nearest')
        collection.insertBefore(draggingCard, nearest.nearestLeftCard)
    }
})

function randomColor() {
    let randomColor = `rgb(${Math.trunc(Math.random() * 256)},${Math.trunc(Math.random() * 256)},${Math.trunc(Math.random() * 256)})`
    return randomColor
}

function findNearest(mouseX, mouseY, cards) {
    let nearestLeftDiffX = Number.NEGATIVE_INFINITY
    let nearestLeftDiffY = Number.POSITIVE_INFINITY
    let nearestDiffX = Number.POSITIVE_INFINITY
    let nearestDiffY = Number.POSITIVE_INFINITY
    let nearestLeftCard = null
    let nearestCard = null
    let lastCard = null
    let nearestBox = {}
    cards.forEach(card => {
        let cardBox = card.getBoundingClientRect()
        let cardCenterX = cardBox.left + cardBox.width / 2
        let cardCenterY = cardBox.top + cardBox.height / 2
        // console.log(`card center: ${cardCenterX} ${cardCenterY}`)
        // console.log(`mouse position: ${mouseX} ${mouseY}`)
        let diffX = mouseX - cardCenterX
        let diffY = mouseY - cardCenterY

        let absDiffX = Math.abs(diffX)
        let absDiffY = Math.abs(diffY)

        if (diffX < 0) {
            if ( (diffX >= nearestLeftDiffX) && (Math.abs(diffY) <= nearestLeftDiffY) ) {
                nearestLeftDiffX = diffX
                nearestLeftDiffY = Math.abs(diffY)
                nearestLeftCard = card
                nearestBox = cardBox
            }
        }

        if ( (absDiffX <= nearestDiffX) && (absDiffY <= nearestDiffY) ) {
            nearestDiffX = absDiffX
            nearestDiffY = absDiffY
            nearestCard = card
        }
     

    })
    // console.log(nearestBox)
    return {nearestLeftCard: nearestLeftCard, nearestCard: nearestCard}
}

