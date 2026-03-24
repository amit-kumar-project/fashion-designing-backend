import { ObjectId } from 'mongodb';

export class Design {
  constructor(db) {
    this.collection = db.collection('designs');
  }

  async create(designData) {
    const result = await this.collection.insertOne({
      ...designData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result;
  }

  async findById(designId) {
    return await this.collection.findOne({ _id: new ObjectId(designId) });
  }

  async findByUserId(userId) {
    return await this.collection.find({ userId: new ObjectId(userId) }).toArray();
  }

  async update(designId, updateData) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(designId) },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );
    return result;
  }

  async delete(designId) {
    return await this.collection.deleteOne({ _id: new ObjectId(designId) });
  }

  async findAll(filter = {}) {
    return await this.collection.find(filter).toArray();
  }

  async search(query) {
    return await this.collection.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [query] } }
      ]
    }).toArray();
  }
}
