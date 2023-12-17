import { MetaQuery, pickNotDeprecated } from '@refinedev/core';
import axios from 'axios';
import { IUser } from 'interfaces/types';
import { stringify } from 'qs';

interface ILoginResponse {
  jwt: string;
  user: IUser;
}

export type MeOptions = {
  meta?: MetaQuery;
  /**
   * @deprecated `metaData` is deprecated with refine@4, refine will pass `meta` instead, however, we still support `metaData` for backward compatibility.
   */
  metaData?: MetaQuery;
};

export const AuthHelper = (apiUrl: string) => ({
  login: async (identifier: string, password: string) => {
    const url = `${apiUrl}/auth/local`;

    return await axios.post<ILoginResponse>(url, {
      identifier,
      password,
    });
  },
  me: async (token: string, options?: MeOptions) => {
    const { meta: _meta, metaData } = options ?? {};
    const meta = pickNotDeprecated(_meta, metaData);
    const locale = meta?.locale;
    const fields = meta?.fields;
    const populate = meta?.populate;

    const query = {
      fields,
      locale,
      populate,
    };

    return await axios.get<IUser>(
      `${apiUrl}/users/me?${stringify(query, {
        encodeValuesOnly: true,
      })}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },
});
