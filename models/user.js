import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      unique: true,
      index: true,
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  {
    timeseries: true,
  },
);

export default mongoose.model('User', UserSchema);
