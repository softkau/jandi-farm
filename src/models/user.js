import { Schema, model, models } from 'mongoose';

// TODO: 이상한 username이나 email 못 들어오게 하기
const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required'],
  },
  username: {
    type: String,
    required: [true, 'Username is required!'],
  },
  image: {
    type: String,
  }
});

// ensure model() is called once
const User = models.User || model("User", UserSchema);

export default User;