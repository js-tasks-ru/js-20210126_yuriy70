class Tooltip {
  onPointerOver = e => {
    if (e.target.dataset.tooltip) {
      this.render(e.target.dataset.tooltip);
      e.target.addEventListener('pointermove', this.onPointerMove);
      e.target.addEventListener('pointerout', this.onPointerOut);
    }
  }

  onPointerOut = e => {
    this.remove();
    e.target.removeEventListener('pointermove', this.onPointerMove);
    e.target.removeEventListener('pointerout', this.onPointerOut);
  }

  onPointerMove = e => {
    if (this.element) {
      this.element.style.left = e.clientX + 10 + 'px';
      this.element.style.top = e.clientY + 10 + 'px';
    }
  }

  initialize() {
    document.removeEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerover', this.onPointerOver);
  }

  render(text) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="tooltip">${text}</div>`;
    this.element = wrapper.firstElementChild;
    document.body.append(this.element);
  }

  remove() {
    this.element?.remove();
  }

  destroy() {
    document.removeEventListener('pointerover', this.onPointerOver);
    this.remove();
  }
}

const tooltip = new Tooltip();

export default tooltip;
