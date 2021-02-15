class Tooltip {
  static handlePointerOver;
  static handlePointerOut;
  static handlePointerMove;

  onPointerOver(e) {
    if (e.target.dataset.tooltip) {
      this.render(e.target.dataset.tooltip);
    }
  }

  onPointerOut(e) {
    if (e.target.dataset.tooltip) {
      this.remove();
    }
  }

  onPointerMove(e) {
    if (e.target.dataset.tooltip && this.element) {
      this.element.style.left = e.clientX + 10 + 'px';
      this.element.style.top = e.clientY + 10 + 'px';
    }
  }

  initialize() {
    document.removeEventListener('pointerover', this.constructor.handlePointerOver);
    this.constructor.handlePointerOver = this.onPointerOver.bind(this);
    document.addEventListener('pointerover', this.constructor.handlePointerOver);

    document.removeEventListener('pointerout', this.constructor.handlePointerOut);
    this.constructor.handlePointerOut = this.onPointerOut.bind(this);
    document.addEventListener('pointerout', this.constructor.handlePointerOut);

    document.removeEventListener('pointermove', this.constructor.handlePointerMove);
    this.constructor.handlePointerMove = this.onPointerMove.bind(this);
    document.addEventListener('pointermove', this.constructor.handlePointerMove);
  }

  render(text) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="tooltip">${text}</div>`;
    this.element = wrapper.firstElementChild;
    document.body.append(this.element);
  }

  remove() {
    if (this.element) this.element.remove();
  }

  destroy() {
    document.removeEventListener('pointerover', this.constructor.handlePointerOver);
    document.removeEventListener('pointerout', this.constructor.handlePointerOut);
    document.removeEventListener('pointermove', this.constructor.handlePointerMove);
    this.remove();
  }
}

const tooltip = new Tooltip();

export default tooltip;
