import { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

// ensure model() is called once
const Project = models.Project || model("Project", ProjectSchema);

export default Project;