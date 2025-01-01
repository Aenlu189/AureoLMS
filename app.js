const BASEURL = 'http://localhost:8080';
const API = {
    GET_BOOKS: BASEURL + '/books',
    CREATE_BOOK: BASEURL + '/books',
    CHECKOUT: BASEURL + '/checkout',
    RETURN: BASEURL + '/return'
};

// Utility Functions
function showToast(message, isError = false) {
    const toastContainer = document.querySelector('.toast-container');
    const toastEl = document.createElement('div');

    toastEl.className = `toast align-items-center ${isError ? 'bg-danger' : 'bg-success'} text-white border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toastEl);
    new bootstrap.Toast(toastEl).show();

    setTimeout(() => {
        toastEl.remove();
    }, 5000);
}

