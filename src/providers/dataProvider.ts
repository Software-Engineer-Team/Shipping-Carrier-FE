import { HttpError, DataProvider as IDataProvider } from '@refinedev/core';
import { AxiosInstance } from 'axios';
import { stringify } from 'qs';

import { axiosInstance, generateFilter, generateSort, normalizeData, transformHttpError } from './utilities';

export const DataProvider = (apiUrl: string, httpClient: AxiosInstance = axiosInstance): Required<IDataProvider> => ({
  create: async ({ resource, variables }) => {
    const url = `${apiUrl}/${resource}`;

    let dataVariables: any = { data: variables };

    if (resource === 'users') {
      dataVariables = variables;
    }

    try {
      const { data } = await httpClient.post(url, dataVariables);
      return {
        data,
      };
    } catch (error) {
      const httpError = transformHttpError(error);

      throw httpError;
    }
  },

  createMany: async ({ resource, variables }) => {
    const errors: HttpError[] = [];

    const response = await Promise.all(
      variables.map(async param => {
        try {
          const { data } = await httpClient.post(`${apiUrl}/${resource}`, {
            data: param,
          });
          return data;
        } catch (error) {
          const httpError = transformHttpError(error);

          errors.push(httpError);
        }
      }),
    );

    if (errors.length > 0) {
      throw errors;
    }

    return { data: response };
  },

  custom: async ({ filters, headers, method, payload, query, sorters, url }) => {
    let requestUrl = `${url}?`;

    if (sorters) {
      const sortQuery = generateSort(sorters);
      if (sortQuery.length > 0) {
        requestUrl = `${requestUrl}&${stringify({
          sort: sortQuery.join(','),
        })}`;
      }
    }

    if (filters) {
      const filterQuery = generateFilter(filters);
      requestUrl = `${requestUrl}&${filterQuery}`;
    }

    if (query) {
      requestUrl = `${requestUrl}&${stringify(query)}`;
    }

    if (headers) {
      httpClient.defaults.headers = {
        ...httpClient.defaults.headers,
        ...headers,
      };
    }

    let axiosResponse;
    switch (method) {
      case 'put':
      case 'post':
      case 'patch':
        axiosResponse = await httpClient[method](url, payload);
        break;
      case 'delete':
        axiosResponse = await httpClient.delete(url, {
          data: payload,
        });
        break;
      default:
        axiosResponse = await httpClient.get(requestUrl);
        break;
    }

    const { data } = axiosResponse;

    return Promise.resolve({ data });
  },

  deleteMany: async ({ ids, resource }) => {
    const response = await Promise.all(
      ids.map(async id => {
        const { data } = await httpClient.delete(`${apiUrl}/${resource}/${id}`);
        return data;
      }),
    );
    return { data: response };
  },

  deleteOne: async ({ id, resource }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await httpClient.delete(url);

    return {
      data,
    };
  },

  getApiUrl: () => {
    return apiUrl;
  },

  getList: async ({ filters, meta, pagination, resource, sorters }) => {
    const url = `${apiUrl}/${resource}`;

    const { current = 1, mode = 'server', pageSize = 10 } = pagination ?? {};

    const locale = meta?.locale;
    const fields = meta?.fields;
    const populate = meta?.populate;
    const publicationState = meta?.publicationState;

    const querySorters = generateSort(sorters);
    const queryFilters = generateFilter(filters);

    const query = {
      ...(mode === 'server'
        ? {
            'pagination[page]': current,
            'pagination[pageSize]': pageSize,
          }
        : {}),
      fields,
      locale,
      populate,
      publicationState,
      sort: querySorters.length > 0 ? querySorters.join(',') : undefined,
    };

    const { data } = await httpClient.get(
      `${url}?${stringify(query, {
        encodeValuesOnly: true,
      })}&${queryFilters}`,
    );

    return {
      data: normalizeData(data),
      // added to support pagination on client side when using endpoints that provide only data (see https://github.com/refinedev/refine/issues/2028)
      total: data.meta?.pagination?.total || normalizeData(data)?.length,
    };
  },

  getMany: async ({ ids, meta, resource }) => {
    const url = `${apiUrl}/${resource}`;

    const locale = meta?.locale;
    const fields = meta?.fields;
    const populate = meta?.populate;
    const publicationState = meta?.publicationState;

    const queryFilters = generateFilter([
      {
        field: 'id',
        operator: 'in',
        value: ids,
      },
    ]);

    const query = {
      fields,
      locale,
      'pagination[pageSize]': ids.length,
      populate,
      publicationState,
    };

    const { data } = await httpClient.get(
      `${url}?${stringify(query, {
        encodeValuesOnly: true,
      })}&${queryFilters}`,
    );

    return {
      data: normalizeData(data),
    };
  },

  getOne: async ({ id, meta, resource }) => {
    const locale = meta?.locale;
    const fields = meta?.fields;
    const populate = meta?.populate;

    const query = {
      fields,
      locale,
      populate,
    };

    const url = `${apiUrl}/${resource}/${id}?${stringify(query, {
      encode: false,
    })}`;

    const { data } = await httpClient.get(url);

    return {
      data: normalizeData(data),
    };
  },

  update: async ({ id, resource, variables }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    let dataVariables: any = { data: variables };

    if (resource === 'users') {
      dataVariables = variables;
    }

    try {
      const { data } = await httpClient.put(url, dataVariables);
      return {
        data,
      };
    } catch (error) {
      const httpError = transformHttpError(error);

      throw httpError;
    }
  },

  updateMany: async ({ ids, resource, variables }) => {
    const errors: HttpError[] = [];

    const response = await Promise.all(
      ids.map(async id => {
        const url = `${apiUrl}/${resource}/${id}`;

        let dataVariables: any = { data: variables };

        if (resource === 'users') {
          dataVariables = variables;
        }

        try {
          const { data } = await httpClient.put(url, dataVariables);
          return data;
        } catch (error) {
          const httpError = transformHttpError(error);

          errors.push(httpError);
        }
      }),
    );

    if (errors.length > 0) {
      throw errors;
    }

    return { data: response };
  },
});
