import { Schema, model, models } from 'mongoose';

const TodoSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'owner is required']
  },
  title: {
    type: String,
    required: [true, 'title is required!']
  },
  due_date: {
    type: Date,
    required: [true, 'due_date is required!']
  },
  detail: {
    type: String,
    required: [true, 'detail is required!']
  },
  tag: {
    type: String,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }
});

// ensure model() is called once
const Todo = models.Todo || model("Todo", TodoSchema);

export default Todo;