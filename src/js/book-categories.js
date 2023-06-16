//    API
import Notiflix from 'notiflix';

async function fetchBooks() {
  const URL = 'https://books-backend.p.goit.global/books/top-books';
  try {
    const responce = await fetch(URL);
    const data = await responce.json();
    return data;
  } catch (error) {
    Notiflix.Notify.failure('We didnt find any book');
    console.log(error.message);
  }
}

async function fetchByCategory(categoryName) {
  try {
    const url = `${ENDPOINT}?category=${categoryName}`;
    const query = await fetch(url);
    if (!query.ok) {
      throw new Error(`Server responded with status: ${query.status}`);
    }
    const jsonQuery = await query.json();
    return jsonQuery;
  } catch (error) {
    console.error(`Failed to fetch category: ${error.message}`);
    return [];
  }
}
//
import bigPlaceholder from '../images/placeholders/big-placeholder.png';
import mediumPlaceholder from '../images/placeholders/medium-placeholder.png';
import smallPlaceholder from '../images/placeholders/small-placeholder.png';

const allCategoryBtn = document.querySelector('#allCategoryBtn');

const listRef = document.querySelector('.category__list'); // ul в який додається список категорій книг
const bookListRef = document.querySelector('.category__books'); // ul в який додаються книги конкретної категорії
const sortTitle = document.querySelector('.category-title'); // h2 заголовок - назва книги
const categorieList = document.querySelector('.categorie-list'); // ul в який додається перелік книг всіх категорій
const allBooksTitle = document.querySelector('.all-books-title'); //

allCategoryBtn.addEventListener('click', onAllCategoriesClick);

function onAllCategoriesClick() {
  startPage();
}

startPage();

function markupBooks(array) {
  let bestBooks;
  const categories = array
    .map(arr => {
      bestBooks = arr.books
        .map(({ _id, book_image, title, author }) => {
          let placeholder;
          const imgSrc = true ? `${book_image}` : placeholder;
          if (arr.length === 0) {
            placeholder = bigPlaceholder;
            Notiflix.Notify.failure('We didnt find any book');
            if (window.innerWidth < 768) {
              placeholder = smallPlaceholder;
            } else if (window.innerWidth < 1280) {
              placeholder = mediumPlaceholder;
            }
          }
          return `
          <li class="book" id="${_id}">
            <div class="thumb">
              <img loading="lazy" class="book-photo" src="${imgSrc}" alt="${
            title || 'Not found'
          }" />
            </div>
            <h3 class="book-name">${title || 'Not found'}</h3>
            <span class="book-author">${author || 'No name'}</span>
            <div class="all-book-popup"> quick view </div>
          </li>`;
        })
        .join('');
      return `
        <li class="categorie">
          <div>
            <h3 class="categorie-name">${arr.list_name}</h3>
            <ul class="book-list">
              ${bestBooks}
            </ul>
            <button class="btn-look" type="button" name="${arr.list_name}">See more</button>
          </div> 
        </li> 
      `;
    })
    .join('');

  return categories;
}

async function startPage() {
  bookListRef.innerHTML = '';
  sortTitle.style.display = 'none';
  allBooksTitle.style.display = 'block';
  try {
    const data = await fetchBooks();
    const markup = await markupBooks(data);
    categorieList.innerHTML = markup;
  } catch (error) {
    console.log(error.message);
  }
  Loading.remove(500);
}
// код для відмальовки книг
const ENDPOINT = 'https://books-backend.p.goit.global/books/category';
listRef.addEventListener('click', onCategoryCatch);
categorieList.addEventListener('click', onSeeMoreBtn);

function resetActiveState() {
  let activeElements = listRef.querySelectorAll('.active');
  activeElements.forEach(el => el.classList.remove('active'));
}
async function onSeeMoreBtn(e) {
  if (e.target.nodeName !== 'BUTTON') return;
  const query = e.target.closest('button').name;
  try {
    categorieList.innerHTML = '';
    allBooksTitle.style.display = 'none';
    sortTitle.style.display = 'block';
    const caughtCategory = await fetchByCategory(query);
    const paintedList = await paintMarkup(caughtCategory, query);
    bookListRef.innerHTML = paintedList;
    resetActiveState();
    e.target.classList.add('active');
  } catch (error) {
    console.error(error.message);
  }
}
async function onCategoryCatch(e) {
  if (e.target.nodeName !== 'BUTTON') return;
  const categoryName = e.target.name;
  try {
    categorieList.innerHTML = '';
    if (categoryName === 'All categories') {
      allBooksTitle.style.display = 'block';
      sortTitle.style.display = 'none';
      resetActiveState();
      e.target.classList.add('active');
    } else {
      allBooksTitle.style.display = 'none';
      sortTitle.style.display = 'block';
      const caughtCategory = await fetchByCategory(categoryName);
      const paintedList = await paintMarkup(caughtCategory, categoryName);
      bookListRef.innerHTML = paintedList;
      resetActiveState();
      e.target.classList.add('active');
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function paintMarkup(arr, categoryName) {
  let words = categoryName.split(' ');
  words[words.length - 1] = `<span class='highlight'>${
    words[words.length - 1]
  }</span>`;
  categoryName = words.join(' ');
  const categoryTitleRef = document.querySelector('.category-title');
  categoryTitleRef.innerHTML = `<h2 class="category-title">${categoryName}</h2>`;
  let markup = '';
  markup += arr
    .map(
      ({ title, author, book_image, _id }) =>
        `<li id="${_id}" class="books">
          <img loading="lazy" src="${book_image}" alt="${title}" />
          <h3>${title}</h3>
          <p>${author}</p>
         <div class="book-popup"> quick view </div>
      </li>`
    )
    .join('');
  return markup;
}
