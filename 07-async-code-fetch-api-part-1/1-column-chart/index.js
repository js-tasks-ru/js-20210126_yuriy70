import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  element;
  subElements = {};
  chartHeight = 50;
  data = {};

  constructor({
    url = '',
    range = {
      from: new Date(),
      to: new Date(),
    },
    label = '',
    link = '',
    formatHeading = data => data,
  } = {}) {
    this.url = new URL(url, BACKEND_URL);
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;
    
    this.render();
    this.loadData(this.range.from, this.range.to);
  }

  get template() {
    return `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          ${this.link ? `<a href="/${this.link}" class="column-chart__link">View all</a>` : ''}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.header}</div>
          <div data-element="body" class="column-chart__chart">${this.body}</div>
        </div>
      </div>
    `;
  }

  get header() {
    return this.formatHeading(Object.values(this.data).reduce((accum, item) => (accum + item), 0));
  }

  get body() {
    const values = Object.values(this.data);
    const max = Math.max(...values);
   
    return values.map(item => `
      <div style="--value: ${Math.floor(item / max * this.chartHeight)}" data-tooltip="${(item / max * 100).toFixed(0)}%"></div>
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

  async loadData(from, to) {
    this.element.classList.add('column-chart_loading');
    this.subElements.header.innerHTML = '';
    this.subElements.body.innerHTML = '';

    this.url.searchParams.set('from', from.toISOString());
    this.url.searchParams.set('to', to.toISOString());
    const data = await fetchJson(this.url);
    
    if (data && Object.values(data).length) {
      this.data = data;
      this.subElements.header.innerHTML = this.header;
      this.subElements.body.innerHTML = this.body;
      this.element.classList.remove('column-chart_loading');
    }
  }
  
  async update(from, to) {
    return await this.loadData(from, to);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
