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
      <div class="column-chart">
        <div class="column-chart__title"></div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header"></div>
          <div data-element="body" class="column-chart__chart"></div>
        </div>
      </div>
    `;
    this.element = wrapper.firstElementChild;
    this.renderHeight();
    this.renderTitle();
    this.renderHeader();
    this.renderData();
  }

  renderHeight() {
    this.element.style['--chart-height'] = this.chartHeight;
  }

  renderTitle() {
    this.element.querySelector('.column-chart__title').innerHTML =
      this.link ? `${ this.label }<a href="/${ this.link }" class="column-chart__link">View all</a>` : this.label;
  }

  renderHeader() {
    this.element.querySelector('.column-chart__header').innerHTML = this.value;
  }

  renderData() {
    const body = this.element.querySelector('.column-chart__chart');
    if (this.data.length) {
      const max = Math.max(...this.data);
      const factor = this.chartHeight / max;
      body.innerHTML = this.data.map(item => `
        <div style="--value: ${ Math.floor(item * factor) }" data-tooltip="${ (item / max * 100).toFixed(0) }%"></div>
      `).join('');
      this.element.classList.remove('column-chart_loading');
    } else {
      this.element.classList.add('column-chart_loading');
      body.innerHTML = '';
    }
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
