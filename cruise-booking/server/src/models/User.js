const bcrypt = require('bcryptjs');
const mockDb = require('../services/mockDb');

class User {
  static async findOne(query) {
    return await mockDb.findOne('users', query);
  }

  static async create(userData) {
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
    
    return await mockDb.create('users', userData);
  }

  static async findById(id) {
    return await mockDb.findById('users', id);
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    try {
      return await bcrypt.compare(candidatePassword, hashedPassword);
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = User;
