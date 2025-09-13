import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Todo } from "../features/todos/types.ts"

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://68c3db4e81ff90c8e61a53f0.mockapi.io/' }),
  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => 'todos',
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Todos' as const, id })),
            { type: 'Todos' as const, id: 'LIST' },
          ]
          : [{ type: 'Todos' as const, id: 'LIST' }],
    }),
    addTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (body) => ({ url: 'todos', method: 'POST', body }),
      invalidatesTags: [{ type: 'Todos', id: 'LIST' }],
    }),
    updateTodo: builder.mutation<Todo, Todo>({
      query: ({ id, ...todo }) => ({
        url: `todos/${id}`,
        method: 'PUT',
        body: todo,
      }),
      async onQueryStarted(updatedTodo, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
            const index = draft.findIndex((t) => t.id === updatedTodo.id)

            if (index !== -1) {
              draft[index] = updatedTodo
            }
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),

    deleteTodo: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `todos/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
            return draft.filter((t) => t.id !== id)
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo() // rollback
        }
      },
    }),
  }),
})

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi
