const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose



// Validate Function to check body length
let commentLengthChecker = (comment) => {
  // Check if body exists
  if (!comment) {
    return false; // Return error
  } else {
    // Check length of body
    if (comment.length < 5 || comment.length > 500) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid body
    }
  }
};

// Array of Body validators
const commentValidators = [
  // First Body validator
  {
    validator: commentLengthChecker,
    message: 'Comment must be more than 5 characters but no more than 500.'
  }
];


// Blog Model Definition
const queueSchema = new Schema({
  comment: { type: String, required: true, validate: commentValidators },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now() },
});

// Export Module/Schema
module.exports = mongoose.model('Queue', queueSchema);