import Sortable from 'sortablejs/modular/sortable.complete.esm.js';

var el = document.getElementById('items');

var sortable = Sortable.create(el, {
    group: "sorting",
    sort: true,
    animation: 150,
})

