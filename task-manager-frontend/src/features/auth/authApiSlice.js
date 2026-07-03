import { apiSlice } from '../api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
    }),
    deleteAccount: builder.mutation({
  query: () => ({
    url: '/auth/delete-account',
    method: 'DELETE',
  }),
}),
updateProfile: builder.mutation({
  query: (data) => ({
    url: '/auth/update-profile',
    method: 'PUT',
    body: data,
  }),
}),
  }),

});

export const { 
  useRegisterMutation, 
  useLoginMutation, 
  useGetMeQuery, 
  useDeleteAccountMutation,
  useUpdateProfileMutation 
} = authApiSlice;