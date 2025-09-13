import React, { useState, useEffect, useCallback } from "react"
import cn from 'classnames'
import styles from "./Header.module.css"
import Logo from "../../assets/icons/logo.svg"
import { SuccessIcon, ErrorIcon, AddIcon, TaskMasterIcon } from "../icons"
import { useAddTodoMutation } from "../../api/todoApi.ts"

const Header: React.FC = () => {
  const [title, setTitle] = useState("")
  const [addTodo, { isLoading, isError, isSuccess, reset }] = useAddTodoMutation()

  const handleAdd = useCallback(async () => {
    if (!title.trim()) {
      return
    }

    try {
      await addTodo({ title, status: 'todo' }).unwrap()

      setTitle('')
    } catch (error) {
      console.error('Error adding todo', error)
    }
  }, [title, addTodo])

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAdd()
    }
  }, [handleAdd])

  const getIcon = useCallback(() => {
    if (isLoading) {
      return <div className={ styles.spinner }></div>
    }

    if (isSuccess) {
      return <SuccessIcon />
    }

    if (isError) {
      return <ErrorIcon />
    }

    return <AddIcon />
  }, [isLoading, isSuccess, isError])

  useEffect(() => {
    if (isSuccess || isError) {
      const timer = setTimeout(() => reset(), 2000)

      return () => clearTimeout(timer)
    }
  }, [isSuccess, isError, reset])

  return (
    <div className={ styles.header }>
      <div className={ styles.leftGroup }>
        <img src={ Logo } alt="Logo" className={ styles.logo } />

        <input
          className={ styles.input }
          placeholder="Add new task..."
          value={ title }
          onChange={ (e) => setTitle(e.target.value) }
          onKeyDown={ handleKeyPress }
        />

        <button
          className={ cn(styles.addBtn, {
            [styles.loading]: isLoading,
            [styles.success]: isSuccess,
            [styles.error]: isError,
          }) }
          onClick={ handleAdd }
          disabled={ !title || isSuccess || isLoading || isError }>

          { getIcon() }
        </button>
      </div>

      <div className={ styles.rightGroup }>
        <h1 className={ styles.title }>Task Master</h1>

        <TaskMasterIcon/>
      </div>
    </div>
  )
}

export default Header
