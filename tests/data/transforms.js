class ExclamationTransform {
  constructor(times) {
    this.times = times;
  }
  json(payload) {
    for (let i = 0; i < this.times; i++) {
      payload.text += "!";
    }
    return Promise.resolve(payload);
  }
}
module.exports = {
  ExclamationTransform,
}
