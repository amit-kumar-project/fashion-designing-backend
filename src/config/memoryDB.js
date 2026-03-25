// In-memory database for temporary use
class MemoryDB {
  constructor() {
    this.collections = {
      users: [],
      designs: []
    };
    this.nextId = 1;
  }

  collection(name) {
    return new MemoryCollection(this.collections[name], () => this.nextId++);
  }

  db() {
    return this;
  }
}

class MemoryCollection {
  constructor(data, getNextId) {
    this.data = data;
    this.getNextId = getNextId;
  }

  async insertOne(doc) {
    const id = this.getNextId().toString();
    const newDoc = { ...doc, _id: id, createdAt: new Date(), updatedAt: new Date() };
    this.data.push(newDoc);
    return { insertedId: id };
  }

  async findOne(query) {
    if (query._id) {
      return this.data.find(doc => doc._id === query._id);
    }
    if (query.email) {
      return this.data.find(doc => doc.email === query.email);
    }
    if (query.phoneNumber) {
      return this.data.find(doc => doc.phoneNumber === query.phoneNumber);
    }
    return null;
  }

  async find(query = {}) {
    if (query.userId) {
      return this.data.filter(doc => doc.userId === query.userId);
    }
    return this.data;
  }

  async toArray() {
    return this.data;
  }

  async updateOne(query, update) {
    const index = this.data.findIndex(doc => 
      doc._id === query._id
    );
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...update.$set, updatedAt: new Date() };
      return { matchedCount: 1, modifiedCount: 1 };
    }
    return { matchedCount: 0, modifiedCount: 0 };
  }

  async deleteOne(query) {
    const index = this.data.findIndex(doc => doc._id === query._id);
    if (index !== -1) {
      this.data.splice(index, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async search(searchQuery) {
    const query = searchQuery.toLowerCase();
    return this.data.filter(doc => 
      doc.title?.toLowerCase().includes(query) ||
      doc.description?.toLowerCase().includes(query) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }
}

export const connectDB = async () => {
  console.log('Using in-memory database (for development/testing)');
  return new MemoryDB();
};
