const BASEURL = 'http://localhost:8080';
const API = {
    GET_BOOKS: BASEURL + '/books',
    CREATE_BOOK: BASEURL + '/books',
    CHECKOUT: BASEURL + '/checkout',
    RETURN: BASEURL + '/return'
};

// Utility Functions
function showToast(message, isError=false) {
    const toastContainer = document.querySelector('.toast-container');
    const toastEl = document.createElement('div');

    toastEl.className = `toast align-items-center ${isError ? 'bg-danger' : 'bg-success'} text-white border-0`;
    toastEl.setAttribute('role', 'alert')
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    toastContainer.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    setTimeout(() => toast.remove(), 5000);
}

// Book Management Functions
async function fetchBooks() {
    try {
        const response = await fetch(API.GET_BOOKS);
        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        showToast('Error fetching books: ' + error.messsage, true);
    }
}

