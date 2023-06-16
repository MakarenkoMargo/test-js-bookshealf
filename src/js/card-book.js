import axios from 'axios';

export async function getTopBooks() {
  try {
    const response = await axios.get(
      'https://books-backend.p.goit.global/books/top-books'
    );
    const data = response.data;

    const booksData = data
      .map(item => {
        const books = item.books;
        return books.map(book => {
          const { title, author, description } = book;
          return {
            title,
            author,
            description,
          };
        });
      })
      .flat();

    return booksData;
  } catch (error) {
    console.log('Виникла помилка при отриманні даних:', error);
    return []; // Повертаємо пустий масив у разі помилки
  }
}

// Виклик функції
getTopBooks().then(booksData => {
  console.log(booksData);
});

getTopBooks().then(booksData => {
  const container = document.querySelector('.book-card');

  // Перебираємо перші 5 книг
  for (let i = 0; i < 5 && i < booksData.length; i++) {
    const book = booksData[i];

    // Створюємо елементи розмітки
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');

    const bookCardThumb = document.createElement('div');
    bookCardThumb.classList.add('book-card-thumb');
    const bookImage = document.createElement('img');
    bookImage.src =
      'https://ru.wiktionary.org/wiki/%D1%80%D0%B8%D1%81%D1%83%D0%BD%D0%BE%D0%BA#/media/%D0%A4%D0%B0%D0%B9%D0%BB:1.1_Harris_House.png';
    bookImage.alt = 'book-cover';
    bookCardThumb.appendChild(bookImage);

    const modalBookCardContent = document.createElement('div');
    modalBookCardContent.classList.add('modal-book-card-content');
    const title = document.createElement('h2');
    title.textContent = book.title;
    const author = document.createElement('h3');
    author.textContent = book.author;
    const description = document.createElement('p');
    description.textContent = book.description;
    modalBookCardContent.appendChild(title);
    modalBookCardContent.appendChild(author);
    modalBookCardContent.appendChild(description);

    // Додаємо елементи розмітки до контейнера
    bookCard.appendChild(bookCardThumb);
    bookCard.appendChild(modalBookCardContent);
    container.appendChild(bookCard);
  }
});
