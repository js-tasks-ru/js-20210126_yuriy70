export default class SortableTable {
  element;
  subElements = {};

  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');
    if (column) {
      const { id, order } = column.dataset;
      const next = {
        asc: 'desc',
        desc: 'asc',
        '': 'desc',
      };
      this.sort(id, next[order]);
    }
  };

  constructor(headerConfig = [], { data } = []) {
    this.headerConfig = headerConfig;
    this.sorted = headerConfig.find(item => item.sortable && item.order);
    this.data = data;

    this.render();
    this.initEventListners();
  }

  get template() {
    const data = this.sorted ? this.sortData(this.sorted.id, this.sorted.order) : this.data;
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.getHeader()}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.getBody(data)}
        </div>
      </div>
    `;
  }

  getHeader() {
    return this.headerConfig.map(item => `
      <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${item === this.sorted ? item.order : ''}">
        <span>${item.title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>
    `).join('');
  }

  getBody(data = []) {
    return data.map(item => `
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.getRow(item)}
      </a>
    `).join('');
  }

  getRow(row) {
    return this.headerConfig.map(item => item.template ? item.template(row.images) : `
      <div class="sortable-table__cell">${row[item.id]}</div>
    `).join('');
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    
    this.subElements = this.getSubElements();
  }

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  initEventListners() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
  }

  sort(field, order) {
    this.subElements.header.querySelectorAll('[data-sortable="true"]').forEach(item => {
      item.dataset.order = item.dataset.id === field ? order : '';
    });
    const sortedData = this.sortData(field, order);
    this.subElements.body.innerHTML = this.getBody(sortedData);
  }

  sortData(field, order) {
    const direction = ({ asc: 1, desc: -1 })[order];
    if (!direction) return this.data;
    const column = this.headerConfig.find(item => item.id === field);
    const { sortType, customSorting } = column;

    return [...this.data].sort((a, b) => {
      switch (sortType) {
        case 'string':
          return direction * a[field].localeCompare(b[field], ['ru', 'en'], { caseFirst: 'upper' });
        case 'number':
          return direction * (a[field] - b[field]);
        case 'custom':
          return direction * customSorting(a, b);
        default:
          return direction * (a[field] - b[field]);
      }
    });
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
