export default class ColumnChart {
  subElements = {};
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link = '',
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    
    this.render();
  }

  get template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          ${this.link ? `<a href="/${this.link}" class="column-chart__link">View all</a>` : ''}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.value}</div>
          <div data-element="body" class="column-chart__chart">${this.body}</div>
        </div>
      </div>
    `;
  }

  get body() {
    const max = Math.max(...this.data);
    return this.data.map(item => `
      <div style="--value: ${Math.floor(item / max * this.chartHeight)}" data-tooltip="${(item / max * 100).toFixed(0)}%"></div>
    `).join('');
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }

    this.subElements = this.getSubElements();
  }

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  update(data = []) {
    this.data = data;
    this.subElements.body.innerHTML = this.body;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
