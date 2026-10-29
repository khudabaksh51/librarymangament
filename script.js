
const form = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");
const search = document.getElementById("search");
const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");

let books = JSON.parse(localStorage.getItem("libraryBooks")) || [];
let nextId = books.reduce((max, book) =>
    Math.max(max, book.id), 0) + 1;

// Save books in browser storage
function saveBooks() {
    localStorage.setItem("libraryBooks", JSON.stringify(books));
}

// READ: Display books
function displayBooks(filter = "") {
    bookList.innerHTML = "";

    const filteredBooks = books.filter(book =>
        [book.title, book.author, book.category]
            .some(value => value.toLowerCase().includes(filter.toLowerCase()))
    );

    if (filteredBooks.length === 0) {
        bookList.innerHTML =
            '<tr><td colspan="6">No books found</td></tr>';
        return;
    }

    filteredBooks.forEach(book => {
        const row = document.createElement("tr");

        [book.id, book.title, book.author,
         book.category, book.quantity].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actions = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.addEventListener("click", () => editBook(book.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => deleteBook(book.id));

        actions.append(editButton, deleteButton);
        row.appendChild(actions);
        bookList.appendChild(row);
    });
}

// CREATE and UPDATE: Submit form
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const id = document.getElementById("bookId").value;
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const category = document.getElementById("category").value.trim();
    const quantity = Number(document.getElementById("quantity").value);

    if (!title || !author || !category ||
        document.getElementById("quantity").value === "" ||
        !Number.isInteger(quantity) || quantity < 0) {
        alert("Please enter valid book details.");
        return;
    }

    if (id) {
        // UPDATE existing book
        const book = books.find(book => book.id === Number(id));

        if (book) {
            book.title = title;
            book.author = author;
            book.category = category;
            book.quantity = quantity;
            message.textContent = "Book updated successfully!";
        }
    } else {
        // CREATE new book
        books.push({
            id: nextId++,
            title,
            author,
            category,
            quantity
        });

        message.textContent = "Book added successfully!";
    }

    saveBooks();
    displayBooks(search.value);
    form.reset();
    document.getElementById("bookId").value = "";
    submitBtn.textContent = "Add Book";
});

// Load book details into the form
function editBook(id) {
    const book = books.find(book => book.id === id);

    if (!book) return;

    document.getElementById("bookId").value = book.id;
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("category").value = book.category;
    document.getElementById("quantity").value = book.quantity;

    submitBtn.textContent = "Update Book";
    message.textContent = "Edit the details and click Update Book.";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// DELETE a book
function deleteBook(id) {
    const confirmed = confirm("Are you sure you want to delete this book?");

    if (!confirmed) return;

    books = books.filter(book => book.id !== id);

    saveBooks();
    displayBooks(search.value);
    message.textContent = "Book deleted successfully!";
}

// Search books
search.addEventListener("input", function() {
    displayBooks(search.value);
});

// Display saved books when opening the application
displayBooks();
