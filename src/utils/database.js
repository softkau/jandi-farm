import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDB = async () => {
  if (cached.conn) {
    console.log('[알림] 기존 MongoDB 연결 재사용');
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: "jandi_farm",
    }).then((mongoose) => {
      console.log('[알림] MongoDB에 연결되었습니다.');
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
