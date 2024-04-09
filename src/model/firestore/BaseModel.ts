import database from '../../helpers/db-firestore';
import Competition from './Competition';
const hash = require('object-hash');

type WhereType = {
  where: any
}

class BaseModel {

  getModelName() {
    return 'base'
  }

  async findAll() {
    const allElements = await database.collection(this.getModelName()).get();
    const result = [] as any[];
    allElements.forEach((element: any) => {
      result.push( { id: element.id, ...element.data() });
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
}

export default BaseModel;