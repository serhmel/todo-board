import React, { useCallback, useMemo } from "react"
import Column from "../Column/Column"
import styles from "./Board.module.css"
import { TodoIcon, DoingIcon, DoneIcon } from "../icons"
import { useDeleteTodoMutation, useGetTodosQuery, useUpdateTodoMutation } from "../../api/todoApi.ts"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import type { Todo, TodoStatus } from "../../features/todos/types.ts"

const columns: { title: string; status: TodoStatus; icon: React.ReactNode }[] = [
  { title: 'To Do', status: 'todo', icon: <TodoIcon /> },
  { title: 'Doing', status: 'doing', icon: <DoingIcon /> },
  { title: 'Done', status: 'done', icon: <DoneIcon /> },
]

const Board: React.FC = () => {
  const { data: todos = [], isLoading, isError } = useGetTodosQuery()
  const [updateTodo] = useUpdateTodoMutation()
  const [deleteTodo] = useDeleteTodoMutation()

  const todosByStatus = useMemo(() => {
    const map: Record<TodoStatus, Todo[]> = { todo: [], doing: [], done: [] }

    todos.forEach((t) => map[t.status].push(t))

    return map
  }, [todos])

  const moveCard = useCallback(async (id: string, fromStatus: TodoStatus, toStatus: TodoStatus) => {
    if (fromStatus === toStatus) {
      return
    }

    const todo = todos.find((t) => t.id === id)

    if (!todo) {
      return
    }

    try {
      await updateTodo({ ...todo, status: toStatus }).unwrap()
    } catch (error) {
      console.error('Failed to move card:', error)
    }
  }, [todos, updateTodo])

  const handleDelete = useCallback((id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?")

    if (!confirmDelete) {
      return
    }

    deleteTodo(id)
  }, [deleteTodo])

  return (
    <DndProvider backend={ HTML5Backend }>
      <div className={ styles.boardWrapper }>
        { isError && (
          <div className={ styles.errorBanner }>
            Error fetching todos
          </div>
        ) }

        <div className={ styles.board }>
          { columns.map(({ title, status, icon }) => (
            <Column
              key={ status }
              title={ title }
              icon={ icon }
              cards={ todosByStatus[status] }
              moveCard={ moveCard }
              status={ status }
              onDelete={ handleDelete }
            />
          )) }
        </div>

        { isLoading && (
          <div className={ styles.loadingOverlay }>
            <div className={ styles.spinner }></div>
            <span>Loading tasks...</span>
          </div>
        ) }
      </div>
    </DndProvider>
  )
}

export default Board
