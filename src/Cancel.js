class Cancel {
  __CANCEL__ = true;

  constructor (message) {
    this.message = message
  }

  toString () {
    return 'Cancel' + (this.message ? `: ${this.message}` : '')
  }
}

export default Cancel
