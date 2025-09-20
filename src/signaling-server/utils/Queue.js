class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  peek() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  getItems() {
    return this.items;
  }

  containsUserName(userName) {
    return this.items.some(item => item.userName === userName);
  }

  removeByUserName(userName) {
    this.items = this.items.filter(item => item.userName !== userName);
  }
}

module.exports = Queue;
