export default class ColumnChart {
  constructor({ data = [], label = '', value = 0, link = '', chartHeight = 50 } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.chartHeight = chartHeight;
    this.render();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="column-chart" style="--chart-height: ${ this.chartHeight }">
        <div class="column-chart__title">
          ${ this.label }
          ${ this.link ? `<a href="/${ this.link }" class="column-chart__link">View all</a>` : '' }
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${ this.value }</div>
          <div data-element="body" class="column-chart__chart"></div>
        </div>
      </div>
    `;
    this.element = wrapper.firstElementChild;
    this.renderData();
  }

  renderData() {
    const body = this.element.querySelector('.column-chart__chart');
    if (this.data.length) {
      body.innerHTML = this.getDataItems().join('');
      this.element.classList.remove('column-chart_loading');
    } else {
      body.innerHTML = '';
      this.element.classList.add('column-chart_loading');
    }
  }

  getDataItems() {
    const max = Math.max(...this.data);
    return this.data.map(item => {
      const value = Math.floor(item / max * this.chartHeight);
      const tooltip = (item / max * 100).toFixed(0) + '%';
      return `<div style="--value: ${ value }" data-tooltip="${ tooltip }"></div>`;
    });
  }

  update(data = []) {
    this.data = data;
    this.renderData();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
