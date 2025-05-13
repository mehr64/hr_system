const mongoose = require('mongoose');

describe('MongoDB Connection', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should connect to MongoDB', async () => {
    const isConnected = mongoose.connection.readyState;
    expect(isConnected).toBe(1);
  });
});
