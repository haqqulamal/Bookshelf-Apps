document.addEventListener("DOMContentLoaded", function() {
    const inputBookForm = document.getElementById("inputBook");
    const inputBookTitle = document.getElementById("inputBookTitle");
    const inputBookAuthor = document.getElementById("inputBookAuthor");
    const inputBookYear = document.getElementById("inputBookYear");
    const inputBookIsComplete = document.getElementById("inputBookIsComplete");
  
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    const searchBookForm = document.getElementById("searchBook");
    const searchBookTitle = document.getElementById("searchBookTitle");
  
    let books = [];
  
    // Fungsi untuk menghasilkan ID unik untuk setiap buku
    function generateId() {
      return '_' + Math.random().toString(36).substr(2, 9);
    }
  
    // Fungsi untuk merender buku ke rak
    function renderBook(book) {
      const bookItem = document.createElement("article");
      bookItem.classList.add("book_item");
      bookItem.innerHTML = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
        <div class="action">
          <button class="${book.isComplete ? 'green' : 'red'}">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
          <button class="delete">Hapus buku</button>
        </div>
      `;
  
      const deleteButton = bookItem.querySelector('.delete');
      deleteButton.addEventListener('click', function() {
        const bookId = book.id;
        const index = books.findIndex(item => item.id === bookId);
        if (index !== -1) {
          books.splice(index, 1);
          saveData(); // Perbarui data di penyimpanan lokal ketika buku dihapus
          renderBooks();
        }
      });
  
      const toggleButton = bookItem.querySelector('.action button');
      toggleButton.addEventListener('click', function() {
        book.isComplete = !book.isComplete;
        saveData(); // Perbarui data di penyimpanan lokal ketika status buku diubah
        renderBooks();
      });
  
      if (book.isComplete) {
        completeBookshelfList.appendChild(bookItem);
      } else {
        incompleteBookshelfList.appendChild(bookItem);
      }
    }
  
    // Fungsi untuk merender semua buku
    function renderBooks() {
      incompleteBookshelfList.innerHTML = "";
      completeBookshelfList.innerHTML = "";
      books.forEach(book => renderBook(book));
    }
  
    // Fungsi untuk menyimpan data ke localStorage
    function saveData() {
      localStorage.setItem('books', JSON.stringify(books));
    }
  
    // Fungsi untuk memuat data dari Penyimpanan lokal
    function loadData() {
      const data = localStorage.getItem('books');
      if (data) {
        books = JSON.parse(data);
        renderBooks();
      }
    }
  
    // Fungsi untuk menangani perpindahan buku antar rak
    function moveBook(bookId, targetShelf) {
      const bookIndex = books.findIndex(book => book.id === bookId);
      if (bookIndex !== -1) {
        books[bookIndex].isComplete = targetShelf === 'complete';
        saveData(); // Perbarui data di penyimpanan lokal saat buku dipindahkan antar rak
        renderBooks();
      }
    }
  
    // Event Listener untuk submission
    inputBookForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const title = inputBookTitle.value.trim();
      const author = inputBookAuthor.value.trim();
      const year = parseInt(inputBookYear.value.trim(), 10);
      const isComplete = inputBookIsComplete.checked;
  
      if (title && author && !isNaN(year)) {
        const newBook = {
          id: generateId(),
          title,
          author,
          year,
          isComplete
        };
        books.push(newBook);
        saveData(); // Perbarui data di penyimpanan lokal ketika buku baru ditambahkan
        renderBooks();
        inputBookForm.reset();
      } else {
        alert("Harap isi semua bidang dengan benar.");
      }
    });

    // Fungsi untuk mencari buku berdasarkan judul
function searchBooks(query) {
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

  // Kosongkan rak buku sebelum menampilkan hasil pencarian
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  // Render buku yang difilter
  filteredBooks.forEach(book => renderBook(book));
}

// Event listener untuk pengiriman form pencarian
searchBookForm.addEventListener("submit", function(event) {
  event.preventDefault();
  const query = searchBookTitle.value.trim();
  if (query !== "") {
    searchBooks(query);
  } else {
    renderBooks(); // Render semua buku jika permintaan pencarian kosong
  }
});

  
    // Muat data saat halaman dimuat
    loadData();
  
    // Event delegation untuk memindahkan buku antar rak
    document.addEventListener('click', function(event) {
      const target = event.target;
      if (target.classList.contains('green') || target.classList.contains('red')) {
        const bookId = target.closest('.book_item').querySelector('h3').textContent;
        const targetShelf = target.classList.contains('green') ? 'incomplete' : 'complete';
        moveBook(bookId, targetShelf);
      } else if (target.classList.contains('delete')) {
        const bookId = target.closest('.book_item').querySelector('h3').textContent;
        const index = books.findIndex(book => book.id === bookId);
        if (index !== -1) {
          books.splice(index, 1);
          saveData(); // Perbarui data di penyimpanan lokal ketika buku dihapus
          renderBooks();
        }
      }
    });
  });
  