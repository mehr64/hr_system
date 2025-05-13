const mongoose = require('mongoose');
const User = require('../backend/models/User');  // Adjust path based on your project structure

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('should create a new user', async () => {
    const user = new User({
      username: 'test_user',
      password: 'password123',
      role: 'employee',
    });

    const savedUser = await user.save();
    expect(savedUser).toHaveProperty('_id');
    expect(savedUser.username).toBe('test_user');
    expect(savedUser.role).toBe('employee');
  });
});
