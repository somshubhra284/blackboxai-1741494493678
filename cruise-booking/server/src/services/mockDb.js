class MockDB {
  constructor() {
    this.users = new Map();
  }

  async findOne(collection, query) {
    if (collection === 'users') {
      const users = Array.from(this.users.values());
      return users.find(user => 
        user.email === query.$or[0].email || 
        user.phone === query.$or[1].phone
      );
    }
    return null;
  }

  async create(collection, data) {
    if (collection === 'users') {
      const id = Date.now().toString();
      const user = { ...data, _id: id };
      this.users.set(id, user);
      return user;
    }
    return null;
  }

  async findById(collection, id) {
    if (collection === 'users') {
      return this.users.get(id) || null;
    }
    return null;
  }
}

module.exports = new MockDB();
