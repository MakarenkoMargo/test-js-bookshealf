import { APIService } from './API-service';

const apiBook = new APIService();

// імпорт іконок для верстки картки книги в модальному вікні
import amazonPng from '../images/png-icons-shops/amazon-icon1x.png';
import amazonPng2x from '../images/png-icons-shops/amazon-icon2x.png';
import appleBookPng from '../images/png-icons-shops/applebook-icon1x.png';
import appleBookPng2x from '../images/png-icons-shops/applebook-icon2x.png';
import bookShopPng from '../images/png-icons-shops/bookshop-icon1x.png';
import bookShopPng2x from '../images/png-icons-shops/bookshop-icon2x.png';

// тут буде js вікна модалки

// потрібно буде замінити назви класів на ті, які використовували члени команди, тут зараз прописані мої власні
const allModal = document.querySelector('#allModal'); //
const categorieList = document.querySelector('.categorie-list'); //
//const bookList = document.querySelector('.category__books'); //
const bookList = document.querySelector('.category__books'); //
const addStorageBtn = document.querySelector('.add-storage-button'); //
const removeStorageBtn = document.querySelector('.remove-modal-btn'); //
const storageDescription = document.querySelector('.storage-description'); //

const STORAGE_KEY = 'storage-data';
let storageArr = [];
let storageObj = {};

addStorageBtn.addEventListener('click', onStorageAdd);
removeStorageBtn.addEventListener('click', onStorageDelete);
bookList.addEventListener('click', onIdClick);
// categorieList.addEventListener('click', onIdClick);

function onIdClick(e) {
  if (
    e.target.nodeName === 'BUTTON' ||
    e.target.nodeName === 'UL' ||
    e.target.nodeName === 'DIV' ||
    e.target.nodeName === 'H3'
  )
    return;
  const id = e.target.closest('li').id;
  openModalId();
  createModal(id);
}

async function createModal(bookId) {
  allModal.innerHTML = '';
  try {
    const data = await fetchBookById(bookId);
    storageCheck();
    createMarkup(data);
    return data;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}

async function fetchBookById(bookId) {
  try {
    storageObj = {};
    // const response = await fetch(
    //   `https://books-backend.p.goit.global/books/${bookId}`
    // );
    const response = await apiBook.fetchBookInfo(bookId);
    const data = response.data;
    storageObj = {
      book_image: data.book_image,
      title: data.title,
      author: data.author,
      marketAmazon: data.buy_links[0].url,
      marketAppleBooks: data.buy_links[1].url,
      marketBookshop: data.buy_links[4].url,
      list_name: data.list_name,
      id: data._id,
    };
    return data;
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}

function storageCheck() {
  const storageArr = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const idToFind = storageObj.id;

  if (!storageArr || storageArr.length === 0) {
    addStorageBtn.style.display = 'block';
    removeStorageBtn.style.display = 'none';
    return;
  } else {
    const objToFind = storageArr.find(obj => obj.id === idToFind);
    if (!objToFind) {
      addStorageBtn.style.display = 'block';
      removeStorageBtn.style.display = 'none';
    } else {
      addStorageBtn.style.display = 'none';
      removeStorageBtn.style.display = 'block';
    }
  }
}

function createMarkup(data) {
  const bookModalImage = data.book_image;
  const bookTitle = data.title;
  const bookAuthor = data.author;
  const marketAmazon = data.buy_links[0].url;
  const marketAppleBooks = data.buy_links[1].url;
  const marketBookshop = data.buy_links[4].url;

  const html = `  
  <img src="${bookModalImage}" alt="Book Image" class="image-about-book-modal">
  <div class="info-modal">
  <h2 class="title-about-book-modal">${bookTitle}</h2>
  <p class="author-about-book-modal"> ${bookAuthor}</p>
  <p class="text-about-book-modal">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error, iure nam facere exercitationem quibusdam cum in quasi impedit perferendis porro. Vero quos minima doloribus magni corporis beatae ducimus officiis! Rerum?</p>
  <ul class="shop-modal-list"> <li class="shop-modal-item"><a href="${marketAmazon}" target="_blank"
    > <img
     width="62"
    height="19"
    srcset="
    ${amazonPng} 1x,
    ${amazonPng2x} 2x
  "
   src="${amazonPng}"
    alt="Amazon"
  /></a></li>
  <li class="shop-modal-item"><a href="${marketAppleBooks}" target="_blank"
    > <img
    width="33"
    height="32"
    srcset="
    ${appleBookPng} 1x,
    ${appleBookPng2x} 2x
  "
   src="${appleBookPng}"
    alt="AppleBooks"
  /></a></li>
  <li class="shop-modal-item"><a href="${marketBookshop}" target="_blank"
    > <img
    width="38"
    height="36"
    srcset="
    ${bookShopPng} 1x,
    ${bookShopPng2x} 2x
  "
   src="${bookShopPng}"
    alt="Book-Shop"
  /></a></li>
</ul>
</div>
  `;
  allModal.innerHTML = html;
}

function onStorageAdd() {
  const realStorageArr = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const dataToSave = storageObj;
  if (!realStorageArr || realStorageArr.length === 0) {
    storageArr.push(dataToSave);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageArr));
  } else {
    realStorageArr.push(dataToSave);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(realStorageArr));
  }

  storageDescription.textContent =
    'Сongratulations! You have added the book to the shopping list. To delete, press the button “Remove from the shopping list”.';
  storageCheck();
}

function onStorageDelete() {
  storageDescription.textContent = '';

  const idToDelete = storageObj.id;
  const storageArr = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const indexToDelete = storageArr.findIndex(obj => obj.id === idToDelete);
  storageArr.splice(indexToDelete, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storageArr));
  storageCheck();
}
// const modal = document.querySelector('.modal');

const idModal = document.querySelector('.about-book-modal');

const idBackdropModal = document.querySelector('.js-backdrop-modal');
// const allModal = document.querySelector('allModal')

function openModalId() {
  idModal.classList.remove('is-hidden');
  idBackdropModal.classList.remove('is-hidden');
}
