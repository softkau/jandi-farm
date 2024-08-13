import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) {
    console.log('[알림] MongoDB에 이미 연결되어 있습니다.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "jandi_farm",
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    isConnected = true;
    console.log('[알림] MongoDB에 연결되었습니다.');
  } catch (error) {
    console.log('[에러] MongoDB 연결이 실패하였습니다.');
    console.log(error);
  }
}