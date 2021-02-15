export default class SortableTable {
  subElements = {};

  constructor(headerConfig = [], { data } = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    
    this.render();
  }

  get template() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.getHeader(this.headerConfig)}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.getBody(this.data)}
        </div>
      </div>
    `;
  }

  getHeader(header = []) {
    return header.map(item => `
      <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
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

  sort(field, order) {
    this.element.querySelectorAll('.sortable-table__cell').forEach(item => {
      item.dataset.order = '';
    });
    this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`).dataset.order = order;

    const sortedData = this.sortData(field, order);
    this.subElements.body.innerHTML = this.getBody(sortedData);
  }

  sortData(field, order) {
    const direction = ({ asc: 1, desc: -1 })[order];
    if (direction === undefined) return this.data;

    const sortType = this.headerConfig.find(item => item.id === field)?.sortType;
    
    return [...this.data].sort((a, b) => {
      switch (sortType) {
        case 'string':
          return direction * a[field].localeCompare(b[field], ['ru', 'en'], { caseFirst: 'upper' });
        case 'number':
          return direction * (a[field] - b[field]);
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
