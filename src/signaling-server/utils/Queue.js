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

    /**
   * Removes and returns the first item in the queue whose userName
   * is NOT included in the given array.
   * @param {string[]} excludedUserNames - Array of usernames to skip
   * @returns {object|undefined} - The removed item or undefined if none found
   */
  dequeueFirstNotIn(excludedUserNames) {
    const index = this.items.findIndex(
      item => !excludedUserNames.includes(item.userName)
    );

    if (index === -1) {
      return undefined; // all items are excluded
    }

    const [removed] = this.items.splice(index, 1);
    return removed;
  }
}

module.exports = Queue;
