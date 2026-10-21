const EventEmitter = require('events');

/**
 * Practical 10: Dedicated EventEmitter module
 * Decouples asynchronous side effects (notifications, auditing, emails)
 * from the synchronous request-response flow of Express routes.
 */
class TaskEvents extends EventEmitter {}

// Export a singleton instance across the application
module.exports = new TaskEvents();
