export class Photo {
  constructor(data) {
    this.id = data.id || '';
    this.category = data.category || 'uncategorized';
    this.src = data.src || '';
    
    // Aesthetic properties for our broken grid layout
    this.spanModifier = this._calculateSpan();
    this.offsetModifier = this._calculateOffset();
  }

  get url() {
    return this.src;
  }

  // Pseudo-random but deterministic based on ID string
  _hashId() {
    let hash = 0;
    for (let i = 0; i < this.id.length; i++) {
        hash = ((hash << 5) - hash) + this.id.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
  }

  _calculateSpan() {
    const hash = this._hashId();
    // E.g., 1 to 3 grid spans
    return (hash % 3) + 1;
  }

  _calculateOffset() {
    const hash = this._hashId();
    // Offset grid placement for the "broken" feel
    // 0 to 2
    return hash % 3;
  }
}
