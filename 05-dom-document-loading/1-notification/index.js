export default class NotificationMessage {
  static timeout;
  static current;

  constructor(message = '', {
    duration = 2000,
    type = 'success',
  } = {}) {
    const types = {
      success: 'success',
      error: 'error',
    };

    this.message = message;
    this.duration = duration;
    this.type = types[type] || 'success';

    this.render();
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${(this.duration / 1000).toFixed(0)}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">${this.message}</div>
        </div>
      </div>
    `;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
  }

  show(target = document.body) {
    if (this.constructor.current) this.constructor.current.remove();
    this.constructor.current = target.appendChild(this.element);
    if (this.constructor.timeout) clearTimeout(this.constructor.timeout);
    this.constructor.timeout = setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
