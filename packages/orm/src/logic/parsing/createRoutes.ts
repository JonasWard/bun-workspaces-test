import { DataType } from '@/types';
import { getDatabaseFieltNames, getDataBaseType } from './databaseType';

type DBType = Record<string, (Object & { _id: string })[]>;
type SingleOutputMethods<T extends DBType> = {
  [K in keyof T]: (data: T, id: string) => T[K][0] | undefined;
};
type SingleOutputMethodFrontend<T extends DBType> = {
  [K in keyof T]: (id: string) => Promise<T[K][0] | undefined>;
};
type BulkOutputMethods<T extends DBType> = {
  [K in keyof T]: (data: T) => T[K];
};
type BulkOutputMethodFrontend<T extends DBType> = {
  [K in keyof T]: () => Promise<T[K]>;
};
type SingleUpdateMethods<T extends DBType> = {
  [K in keyof T]: (data: T, id: string, dataToChange: Partial<T[K][0]>) => T[K][0] | undefined;
};
type SingleUpdateMethodsFrontend<T extends DBType> = {
  [K in keyof T]: (id: string, dataToChange: Partial<T[K][0]>) => Promise<T[K][0] | undefined>;
};
type BulkUpdateMethods<T extends DBType> = {
  [K in keyof T]: (data: T, ids: string[], dataToChange: Partial<T[K][0]>) => T[K];
};
type BulkUpdateMethodsFrontend<T extends DBType> = {
  [K in keyof T]: (ids: string[], dataToChange: Partial<T[K][0]>) => Promise<T[K]>;
};
type SingleDeleteMethods<T extends DBType> = {
  [K in keyof T]: (data: T, id: string) => T[K][0] | undefined;
};
type SingleDeleteMethodsFrontend<T extends DBType> = {
  [K in keyof T]: (id: string) => Promise<T[K][0] | undefined>;
};
type BulkDeleteMethods<T extends DBType> = {
  [K in keyof T]: (data: T, ids: string[]) => T[K];
};
type BulkDeleteMethodsFrontend<T extends DBType> = {
  [K in keyof T]: (ids: string[]) => Promise<T[K]>;
};

const apiEndPointHasId = {
  SingleOutput: true,
  BulkOutput: false,
  SingleUpdate: true,
  BulkUpdate: false,
  SingleDelete: true,
  BulkDelete: false
};

const apiEndPointMethod = {
  SingleOutput: 'GET',
  BulkOutput: 'GET',
  SingleUpdate: 'POST',
  BulkUpdate: 'POST',
  SingleDelete: 'DELETE',
  BulkDelete: 'DELETE'
};

const apiEndPointCore = (labelName: string, endpointMethod: keyof typeof apiEndPointHasId): string => {
  switch (endpointMethod) {
    case 'SingleOutput':
      return `/${labelName}`;
    case 'BulkOutput':
      return `/${labelName}-all`;
    case 'SingleUpdate':
      return `/${labelName}/update`;
    case 'BulkUpdate':
      return `/${labelName}/update-many`;
    case 'SingleDelete':
      return `/${labelName}/delete`;
    case 'BulkDelete':
      return `/${labelName}/delete-many`;
  }
};

const getBackendApiEndPoint = (labelName: string, endpointMethod: keyof typeof apiEndPointHasId) =>
  apiEndPointCore(labelName, endpointMethod) + (apiEndPointHasId[endpointMethod] ? '/:id' : '');

const getFrontendApiEndPoint = (labelName: string, endpointMethod: keyof typeof apiEndPointHasId) =>
  apiEndPointHasId[endpointMethod]
    ? (id: string) => `${apiEndPointCore(labelName, endpointMethod)}/${id}`
    : () => apiEndPointCore(labelName, endpointMethod);

const fetchWrapper =
  <T>(backendUrl: string, method: keyof typeof apiEndPointHasId, labelName: string, id?: string) =>
  async (body?: string) => {
    try {
      const response = await fetch(`${backendUrl}${getFrontendApiEndPoint(labelName, method)(id!)}`, {
        method: apiEndPointMethod[method],
        body: body ?? null,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
      return (await response.json()) as T;
    } catch (e) {
      console.log(e);
    }
  };

export const getGetMethodForEachReferencableType = <T extends DBType>(dataType: DataType): SingleOutputMethods<T> =>
  Object.fromEntries(
    getDataBaseType(dataType).fields.map(([labelName]) => [
      labelName,
      (data, id) => data[labelName].find((p) => p._id === id)
    ])
  ) as SingleOutputMethods<T>;

export const getGetMethodFrontendForEachReferencableType = <T extends DBType>(
  dataType: DataType,
  backendUrl: string
): SingleOutputMethodFrontend<T> =>
  Object.fromEntries(
    getDataBaseType(dataType).fields.map(([labelName]) => [
      labelName,
      async (id: string) => await fetchWrapper(backendUrl, 'SingleOutput', labelName, id)()
    ])
  ) as SingleOutputMethodFrontend<T>;

export const getGetBulkMethodForEachReferencableType = <T extends DBType>(dataType: DataType): BulkOutputMethods<T> =>
  Object.fromEntries(
    getDataBaseType(dataType).fields.map(([labelName]) => [labelName, (data) => data[labelName]])
  ) as BulkOutputMethods<T>;

export const getGetBulkMethodFrontendForEachReferencableType = <T extends DBType>(
  dataType: DataType,
  backendUrl: string
): BulkOutputMethodFrontend<T> =>
  Object.fromEntries(
    getDataBaseType(dataType).fields.map(([labelName]) => [
      labelName,
      async () => await fetchWrapper(backendUrl, 'BulkOutput', labelName)()
    ])
  ) as BulkOutputMethodFrontend<T>;

export const getPostMethodsForEachReferencableType = <T extends DBType>(dataType: DataType): SingleUpdateMethods<T> =>
  Object.fromEntries(
    getDataBaseType(dataType).fields.map(([labelName]) => [
      labelName,
      (data, id, dataToChange) => {
        const originalObjectIndex = data[labelName].findIndex((o) => o._id === id);
        if (originalObjectIndex !== -1) {
          data[labelName][originalObjectIndex] = { ...data[labelName][originalObjectIndex], ...dataToChange };
          return data[labelName][originalObjectIndex];
        }
        return undefined;
      }
    ])
  ) as SingleUpdateMethods<T>;

export const getPostMethodsFrontendForEachReferencableType = <T extends DBType>(
  dataType: DataType,
  backendUrl: string
): SingleUpdateMethodsFrontend<T> =>
  Object.fromEntries(
    getDataBaseType(dataType).fields.map(([labelName]) => [
      labelName,
      async (id, dataToChange) =>
        await fetchWrapper(backendUrl, 'BulkOutput', labelName, id)(JSON.stringify({ dataToChange }))
    ])
  ) as SingleUpdateMethodsFrontend<T>;

export const getPostBulkMethodsForEachReferencableType = <T extends DBType>(dataType: DataType): BulkUpdateMethods<T> =>
  Object.fromEntries(
    getDataBaseType(dataType).fields.map(([labelName]) => [
      labelName,
      (data, ids, dataToChange) => {
        [...new Set(ids)]
          .map((id) => data[labelName].findIndex((o) => o._id === id))
          .filter((i) => i !== -1)
          .map((originalObjectIndex) => {
            data[labelName][originalObjectIndex] = { ...data[labelName][originalObjectIndex], ...dataToChange };
            return data[labelName][originalObjectIndex];
          });
      }
    ])
  ) as BulkUpdateMethods<T>;

export const getPostBulkMethodFrontendForEachReferencableType = <T extends DBType>(
  dataType: DataType,
  backendUrl: string
): BulkUpdateMethodsFrontend<T> =>
  Object.fromEntries(
    getDataBaseType(dataType).fields.map(([labelName]) => [
      labelName,
      async (ids, dataToChange) =>
        await fetchWrapper(backendUrl, 'BulkUpdate', labelName)(JSON.stringify({ ids, dataToChange }))
    ])
  ) as BulkUpdateMethodsFrontend<T>;

export const getDeleteMethodsForEachReferencableType = <T extends DBType>(dataType: DataType): SingleDeleteMethods<T> =>
  Object.fromEntries(
    getDataBaseType(dataType).fields.map(([labelName]) => [
      labelName,
      (data, id) => {
        const originalObjectIndex = data[labelName].findIndex((o) => o._id === id);
        if (originalObjectIndex !== -1) data[labelName].splice(originalObjectIndex, 1)[0];
        return undefined;
      }
    ])
  ) as SingleDeleteMethods<T>;

export const getDeleteBulkRouteForEachReferencableType = <T extends DBType>(
  dataType: DataType
): Record<keyof T, string> =>
  Object.fromEntries(
    getDataBaseType(dataType).fields.map(([labelName]) => [labelName as any as keyof T, `/${labelName}/delete-many`])
  ) as Record<keyof T, string>;

export const getDeleteMethodsFrontendForEachReferencableType = <T extends DBType>(
  dataType: DataType,
  backendUrl: string
): SingleDeleteMethodsFrontend<T> =>
  Object.fromEntries(
    getDataBaseType(dataType).fields.map(([labelName]) => [
      labelName as any as keyof T,
      async (id) => await fetchWrapper(backendUrl, 'SingleDelete', labelName, id)()
    ])
  ) as SingleDeleteMethodsFrontend<T>;

export const getDeleteBulkMethodsForEachReferencableType = <T extends DBType>(
  dataType: DataType
): BulkDeleteMethods<T> =>
  Object.fromEntries(
    getDataBaseType(dataType).fields.map(([labelName]) => [
      labelName as any as keyof T,
      (data, ids) =>
        [...new Set(ids)]
          .map((id) => data[labelName].findIndex((o) => o._id === id))
          .filter((i) => i !== -1) // getting rid of the `not found` -1 indexes
          .sort((a, b) => b - a) // reverse sorting
          .map((originalObjectIndex) => data[labelName].splice(originalObjectIndex, 1)) // deleting the objects
          .flat()
          .reverse()
    ])
  ) as BulkDeleteMethods<T>;

export const getDeleteBulkMethodFrontendForEachReferencableType = <T extends DBType>(
  dataType: DataType,
  backendUrl: string
): BulkDeleteMethodsFrontend<T> =>
  Object.fromEntries(
    getDataBaseType(dataType).fields.map(([labelName]) => [
      labelName as any as keyof T,
      async (ids) => await fetchWrapper(backendUrl, 'BulkDelete', labelName)(JSON.stringify({ ids }))
    ])
  ) as BulkDeleteMethodsFrontend<T>;

const debugWrapper = (...v: any[]) => {
  console.log(
    v
      .map((e) => (Array.isArray(e) ? e.length : e))
      .reverse()
      .join(', ')
  );
  return v[0];
};

/**
 * Method that registers all the routes on the Elysia app
 * @param app - `Elysia` backend app
 * @param dataType - `DataType`, definition of the object model
 * @param data - `DatabaseType`, actual content to look at
 * @return string json containing the defined routes
 */
export const registerRoutersOnApp = <T extends DBType>(app: any, dataType: DataType, data: T) => {
  Object.entries(getGetMethodForEachReferencableType<T>(dataType)).map(([l, method]) => {
    const backendApiEndpoint = getBackendApiEndPoint(l, 'SingleOutput');
    app.get(backendApiEndpoint, ({ params: { id } }: { params: { id: string } }) =>
      debugWrapper(method(data, id), backendApiEndpoint)
    );
  });

  Object.entries(getGetBulkMethodForEachReferencableType<T>(dataType)).map(([l, method]) => {
    const backendApiEndpoint = getBackendApiEndPoint(l, 'BulkOutput');
    app.get(backendApiEndpoint, () => debugWrapper(method(data), backendApiEndpoint));
  });

  Object.entries(getPostMethodsForEachReferencableType<T>(dataType)).map(([l, method]) => {
    const backendApiEndpoint = getBackendApiEndPoint(l, 'SingleUpdate');
    app.post(backendApiEndpoint, ({ params: { id }, body }: { params: { id: string }; body: any }) =>
      debugWrapper(method(data, id, body), backendApiEndpoint)
    );
  });

  Object.entries(getPostBulkMethodsForEachReferencableType<T>(dataType)).map(([l, method]) => {
    const backendApiEndpoint = getBackendApiEndPoint(l, 'BulkUpdate');
    app.post(backendApiEndpoint, ({ body }: { body: { ids: string[]; dataToChange: any } }) =>
      debugWrapper(method(data, body.ids, body.dataToChange), backendApiEndpoint)
    );
  });

  Object.entries(getDeleteMethodsForEachReferencableType<T>(dataType)).map(([l, method]) => {
    const backendApiEndpoint = getBackendApiEndPoint(l, 'SingleDelete');
    app.delete(backendApiEndpoint, ({ params: { id } }: { params: { id: string } }) =>
      debugWrapper(method(data, id), backendApiEndpoint)
    );
  });

  Object.entries(getDeleteBulkMethodsForEachReferencableType<T>(dataType)).map(([l, method]) => {
    const backendApiEndpoint = getBackendApiEndPoint(l, 'BulkDelete');
    app.delete(backendApiEndpoint, ({ body }: { body: { ids: string[] } }) =>
      debugWrapper(method(data, body.ids), backendApiEndpoint)
    );
  });
};
