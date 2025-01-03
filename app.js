const BASEURL = 'http://localhost:8080';
const API = {
    GET_BOOKS: BASEURL + '/books',
    CREATE_BOOK: BASEURL + '/books',
    DELETE_BOOK: BASEURL + '/books',
    CHECKOUT: BASEURL + '/checkout',
    RETURN: BASEURL + '/return'
};

// Utility Functions
function showToast(message, isError=false) {
    const toastContainer = document.querySelector('.toast-container');
    const toastEl = document.createElement('div');
    
    toastEl.className = `toast align-items-center ${isError ? 'bg-danger' : 'bg-success'} text-white border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>           
        </div>
    `;
    toastContainer.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    setTimeout(() => toastEl.remove(), 5000);
}

async function fetchBooks() {
    try {
        const response = await fetch(API.GET_BOOKS);
        if (!response.ok){
            throw new Error('Failed to fetch books');
        }
        const booksData = await response.json();
        displayBooks(booksData);
    } catch (error) {
        showToast('Error fetching books' + error.message)
    }
}

function displayBooks(books) {
    const container = document.getElementById('booksContainer');
    container.innerHTML = '';
    
    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card book-card h-100">
                <div class="card-body">
                    <span class="badge bg-${book.quantity > 0 ? 'success' : 'danger'} badge-quantity">
                        ${book.quantity} available       
                    </span>
                    <h5 class="card-title mb-3">${book.title}</h5>
                    <p class="card-text text-muted">By ${book.author}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            <button onclick="checkoutBook('${book.id}')" class="btn btn-primary btn-sm ${book.quantity <= 0 ? 'disabled' : ""}">
                                <i class="fas fa-shopping-cart me-2"></i>
                                Checkout
                            </button>
                            <button onclick="returnBook('${book.id}')" class="btn btn-primary btn-sm">
                                <i class="fas fa-undo me-2"></i>
                                Return  
                            </button>
                        </div>
                        <button onclick="deleteBook('${book.id}')" class="btn btn-danger btn-sm">
                            <i class="fas fa-trash me-2"></i>
                            Delete
                        </button>
                    </div>           
                </div>
            </div>
        `;
        container.appendChild(card);
    })
} 

async function checkoutBook(id) {
    try {
        const response = await fetch(`${API.CHECKOUT}?id=${id}`, {method:`PATCH`});
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to checkout book');
        }
        
        showToast('Book checked out successfully');
        fetchBooks();
    } catch (error) {
        showToast(error.message, true)
    }
}

async function returnBook(id) {
    try {
        const response = await fetch(`${API.RETURN}?id=${id}`, {method:'PATCH'});
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to return book');
        }
        
        showToast('Book returned successfully', false);
        fetchBooks();
    } catch(error) {
        showToast(error.message, true);
    }
}

async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }

    try {
        const response = await fetch(`${API.DELETE_BOOK}/${id}`, {method: 'DELETE'});
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete book');
        }

        showToast('Book deleted successfully');
        fetchBooks();
    } catch (error) {
        showToast(error.message, true);
    }
}

async function addBook(event) {
    event.preventDefault()

    const newBook = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        quantity: parseInt(document.getElementById('bookQuantity').value),
        id: Date.now().toString()
    };

    try {
        const response = await fetch(API.CREATE_BOOK, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(newBook)
        });

        if (!response.ok) {
            throw new Error('Failed to add book');
        }
        showToast('Book added successfully');
        document.getElementById('addBookForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('addBookModal')).hide();
        fetchBooks();
    } catch(error) {
        showToast('Error adding book: ' + error.message, true);
    }
}

function filterAndSortBooks(books) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sortBy = document.getElementById('sortSelect').value;

    let filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
    );

    filteredBooks.sort((a, b) => {
        switch(sortBy) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'author':
                return a.author.localeCompare(b.author);
            case 'quantity':
                return b.quantity - a.quantity;
            default:
                return 0;
        }
    });
    return filteredBooks;
}

document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
    document.getElementById('submitBook').addEventListener('click', addBook);
    document.getElementById('searchInput').addEventListener('input', async() => {
        const response = await fetch(API.GET_BOOKS);
        const books = await response.json();
        displayBooks(filterAndSortBooks(books));
    });
    document.getElementById('sortSelect').addEventListener('change', async() => {
        const response = await fetch(API.GET_BOOKS);
        const books = await response.json();
        displayBooks(filterAndSortBooks(books));
    });
});