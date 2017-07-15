var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true //removes leading or trailing whitespace
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: { //_ specifies id ,need id to make todo
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Todo};
