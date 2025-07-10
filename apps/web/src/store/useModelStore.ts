import { create } from 'zustand';
import { DatabaseType } from 'core';
import {
  ExampleDataType,
  getDeleteBulkMethodFrontendForEachReferencableType,
  getGetBulkMethodFrontendForEachReferencableType,
  getPostBulkMethodFrontendForEachReferencableType
} from 'orm';
import { BACKEND_URL } from '@/config/config';

const AllGetMethods = getGetBulkMethodFrontendForEachReferencableType(ExampleDataType, BACKEND_URL);
const AllPostMethods = getPostBulkMethodFrontendForEachReferencableType(ExampleDataType, BACKEND_URL);
const AllDeleteMethods = getDeleteBulkMethodFrontendForEachReferencableType(ExampleDataType, BACKEND_URL);

type ModelStoreType = {
  data: DatabaseType;
  getData: (collectionName: keyof DatabaseType) => Promise<void>;
  updateData: <T extends keyof DatabaseType>(
    collection: T,
    objects: DatabaseType[T],
    dataToChange: Partial<DatabaseType[T][0]>
  ) => Promise<void>;
  deleteData: <T extends keyof DatabaseType>(collection: T, objects: DatabaseType[T]) => Promise<void>;
  getAllData: () => Promise<void>;
};

export const useModelStore = create<ModelStoreType>((set) => ({
  data: {} as DatabaseType,
  getData: async (collection) => {
    const collectionData = await AllGetMethods[collection]();
    set((s) => ({ data: { ...s.data, [collection]: collectionData } }));
  },
  updateData: async (collection, objects, dataToChange) => {
    const changedData = await AllPostMethods[collection](
      objects.map((o) => o._id),
      dataToChange
    );
    set((s) => ({
      data: { ...s.data, [collection]: s.data[collection].map((o) => changedData.find((c) => c._id === o._id) ?? o) }
    }));
  },
  deleteData: async (collection, objects) => {
    const deletedData = await AllDeleteMethods[collection](objects.map((o) => o._id));
    set((s) => ({
      data: {
        ...s.data,
        [collection]: s.data[collection].filter((o) => Boolean(deletedData.find((c) => c._id === o._id)))
      }
    }));
  },
  getAllData: async () => {
    const data = {} as DatabaseType;
    for (const [labelName, getMethod] of Object.entries(AllGetMethods))
      data[labelName as keyof DatabaseType] = (await getMethod()) as any;
    set(() => ({ data }));
  }
}));
