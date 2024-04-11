import database from '../../helpers/db-firestore';
const hash = require('object-hash');

class BaseModel {
  private cache = {} as any;

  getModelName() {
    return 'base'
  }

  private addToCache(data: any[]) {
    this.cache[this.getModelName()] = data;
  }

  async findAll() {
    if (this.cache[this.getModelName()]) return this.cache[this.getModelName()];

    const allElements = await database.collection(this.getModelName()).get();

    this.addToCache(allElements);

    const result = [] as any[];
    allElements.forEach((element: any) => {
      result.push({ id: element.id, ...element.data() });
    });

    return result;
  }

  async findById(id: string) {
    const docRef = await database.collection(this.getModelName()).doc(id).get();
    return { id: docRef.id, ...docRef.data() }
  }

  async create(data: any) {
    const id = hash(data);
    const docRef = await database.collection(this.getModelName()).doc(id);
    docRef.set(data);
    return { id, ...data };
  }

  async updateById(updatedData: any, id: string) {
    const docRef = await database.collection(this.getModelName()).doc(id).get();
    if (!docRef) throw new Error('not found on update');

    const actualData = docRef.data();
    for (const key in updatedData) {
      actualData[key] = updatedData[key];
    }

    const docRefUpdate = await database.collection(this.getModelName()).doc(id);
    docRefUpdate.set(actualData);
  }

  async deleteById(id: string): Promise<any> {
    return database.collection(this.getModelName()).doc(id).delete();
  }
}

export default BaseModel;