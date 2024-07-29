import { Schema, model, models } from 'mongoose';

const TodoSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'owner is required']
  },
  title: {
    type: Schema.Types.String,
    required: [true, 'title is required!']
  },
  due_date: {
    type: Schema.Types.Date,
    required: [true, 'due_date is required!']
  },
  detail: {
    type: Schema.Types.String,
    required: [true, 'detail is required!']
  },
  tags: {
    type: [
      {
        type: Schema.Types.String,
        required: [true, 'null tag is not allowed']
      }
    ],
    default: [],
    required: function() { return this.tags != undefined }
  },
  project: { // One-to-Squillions 부모(프로젝트) 참조
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  done: {
    type: Schema.Types.Boolean,
    default: false,
    required: function() { return this.done != undefined }
  },
  is_public: {
    type: Schema.Types.Boolean,
    default: false,
    required: function() { return this.is_public != undefined }
  }
});

// ensure model() is called once
const Todo = models.Todo || model("Todo", TodoSchema);

export default Todo;