class Queue {
  constructor() {
    this.queue = []
  }

  push(elem) {
    this.queue.push(elem)
  }

  pop() {
    return this.queue.pop()
  }

  isEmpty() {
    return !this.queue.length
  }
}

module.exports = Queue
