import { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
  is_public: {
    type: Schema.Types.Boolean,
    default: false,
    required: function() { return this.is_public != undefined }
  }
});

ProjectSchema.index({owner: 1, title: 1}, {unique: true})

// ensure model() is called once
const Project = models.Project || model("Project", ProjectSchema);

export default Project;