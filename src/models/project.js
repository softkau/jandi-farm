import { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: Schema.Types.String,
    unique: [true, 'Project title must be unique!'],
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
  is_public: {
    type: Schema.Types.Boolean,
    default: false,
    required: function() { return this.is_public != undefined }
  }
});

// ensure model() is called once
const Project = models.Project || model("Project", ProjectSchema);

export default Project;