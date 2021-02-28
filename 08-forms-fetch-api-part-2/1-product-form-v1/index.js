import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element;
  subElements = {};
  subcategories = [];
  defaultFormData = {
    title: '',
    description: '',
    images: [],
    subcategory: '',
    status: 0,
    quantity: 1,
    price: 100,
    discount: 0,
  }

  constructor (productId) {
    this.productId = productId;
  }

  onSubmit = event => {
    event.preventDefault();
    this.save();
  };

  uploadImage = () => {

  };

  async render() {
    const wrapper = document.createElement('div');

    if (this.productId) {
      await this.loadData(this.productId);
    } else {
      this.data = this.defaultFormData;
    }

    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;

    this.subElements = this.getSubElements();
    this.initEventListners();
    return this.element;
  }

  get template() {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара" value="${this.data.title}">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${this.data.description}</textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer">
              <ul class="sortable-list">
                ${this.getImages(this.data.images)}
              </ul>
            </div>
            <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select id="subcategory" class="form-control" name="subcategory">
              ${this.getSubcategoryOptions()}
            </select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input id="price" required="" type="number" name="price" class="form-control" placeholder="100" value="${this.data.price}">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0" value="${this.data.discount}">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1" value="${this.data.quantity}">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select id="status" class="form-control" name="status">
              ${this.getStatusOptions()}
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
        </form>
      </div>
    `;
  }

  getImages(images = []) {
    return images.map(item => `
      <li class="products-edit__imagelist-item sortable-list__item" style="">
        <input type="hidden" name="url" value="${item.url}">
        <input type="hidden" name="source" value="${item.source}">
        <span>
          <img src="icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="Image" src="${item.url}">
          <span>${item.source}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-delete-handle="" alt="delete">
        </button>
      </li>
    `).join('');
  }

  getSubcategoryOptions() {
    return this.subcategories.map(item => `
      <option value="${item.id}"${item.id === this.data.subcategory ? ' selected' : ''}>${item.title}</option>
    `).join('');
  }

  getStatusOptions() {
    const statuses = {
      '1': 'Активен',
      '0': 'Неактивен',
    };
    return Object.entries(statuses).map(([key, value]) => `
      <option value="${key}"${key === this.data.status ? ' selected' : ''}>${value}</option> 
    `).join('');
  }

  async loadData() {
    const [[data], categories] = await Promise.all([this.loadProduct(), this.loadCategories()]);
    this.data = data;
    this.subcategories = this.getSubcategories(categories);
  }

  loadProduct() {
    if (this.productId) {
      const url = new URL('/api/rest/products', BACKEND_URL);
      url.searchParams.set('id', this.productId);
      return fetchJson(url);
    } else {
      return [this.defaultFormData];
    }
  }

  loadCategories() {
    const url = new URL('/api/rest/categories', BACKEND_URL);
    url.searchParams.set('_sort', 'weight');
    url.searchParams.set('_refs', 'subcategory');
    return fetchJson(url);
  }

  getSubcategories(categories = []) {
    return categories.reduce((accum, category) => {
      if (category.subcategories && category.subcategories.length) {
        accum.push(...category.subcategories.map(subcategory => ({
          id: subcategory.id,
          title: `${category.title} > ${subcategory.title}`,
        })));
      }
      return accum;
    },[]);
  }

  initEventListners() {
    /* this.subElements.header.addEventListener('pointerdown', this.onSortClick);
    document.addEventListener('scroll', this.onWindowScroll); */
  }

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
