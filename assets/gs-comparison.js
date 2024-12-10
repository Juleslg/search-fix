export default class ImageComparison extends HTMLElement {
    constructor() { super(); this.init(); }

    init() {
        this.range = this.querySelector('input[type="range"]');
        this.horizontal = this.getAttribute('data-orient') === 'horizontal';

        this.range.addEventListener('mousedown', () => { this.classList.add('scrolling') });
        this.range.addEventListener('mouseup', () => { this.classList.remove('scrolling') });
        this.range.addEventListener('input', () => { this.updatePosition(this.range.value) });
        this.updatePosition(this.range.value);
    }

    updatePosition(value) {
        const distance = this.horizontal ? this.clientWidth : this.clientHeight;
        const max = parseInt(this.range.max, 10);
        const percent = Math.round((value / max) * 100);

        this.style.setProperty('--percent', this.horizontal ? percent + '%' : 100 - percent + '%');
    }
}

if (!customElements.get('image-comparison')) customElements.define('image-comparison', ImageComparison);