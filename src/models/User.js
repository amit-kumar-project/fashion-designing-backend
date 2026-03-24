import { ObjectId } from 'mongodb';

export class User {
  constructor(db) {
    this.collection = db.collection('users');
  }

  async create(userData) {
    const result = await this.collection.insertOne({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result;
  }

  async findById(userId) {
    return await this.collection.findOne({ _id: new ObjectId(userId) });
  }

  async findByEmail(email) {
    return await this.collection.findOne({ email });
  }

  async findByPhoneNumber(phoneNumber) {
    return await this.collection.findOne({ phoneNumber });
  }

  async update(userId, updateData) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );
    return result;
  }

  async delete(userId) {
    return await this.collection.deleteOne({ _id: new ObjectId(userId) });
  }

  async findAll(filter = {}) {
    return await this.collection.find(filter).toArray();
  }
}
