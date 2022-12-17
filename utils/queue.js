class Queue {
  constructor() {
    // The actual queue
    this.elements = {};
    // The index of the head element
    this.head = 0;
    // The index of the tail element
    this.tail = 0;
  }
  enqueue(element) {
    // Add an element on the current tail index
    this.elements[this.tail] = element;
    // Increase the index of the tail element
    // So the next elements are added at the end
    this.tail++;
  }
  dequeue() {
    // If the queue is empty, return "undefined"
    if (this.tail === this.head) {
      return undefined;
    }
    // Pick an element
    const element = this.elements[this.head];
    // Delete it
    delete this.elements[this.head];
    // Increase the head index
    this.head++;
    // Return the element
    return element;
  }
  get size() {
    return this.tail - this.head;
  }
  get empty() {
    return this.head == this.tail;
  }
}

export default Queue;
