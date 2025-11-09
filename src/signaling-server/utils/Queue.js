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
   * Removes and returns the first item in the queue where the username passed 
   * as parameter has not declined the queued user and vice versa.
   * @param {string} username - String of the username of the one looking for a match
   * @param {object[]} connectedSockets - Array of connected socket objects
   * @returns {object|undefined} - The removed item or undefined if none found
   */
  dequeueFirstNotDeclined(username, connectedSockets) {
    const index = this.items.findIndex(
      item => !connectedSockets.find(s => s.userName === username)?.declinedMatches?.includes(item.userName) && !connectedSockets.find(s => s.userName === item.userName)?.declinedMatches?.includes(username)
    );

    if (index === -1) {
      return undefined; // all items are excluded
    }

    const [removed] = this.items.splice(index, 1);
    return removed;
  }
}

module.exports = Queue;
