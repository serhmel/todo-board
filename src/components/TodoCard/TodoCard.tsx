import React, { useEffect, useRef } from 'react'
import styles from './TodoCard.module.css'
import { useDrag } from "react-dnd"
import type { Todo } from '../../features/todos/types'

interface TodoCardProps extends Todo {
    onDelete: (id: string) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ id, title, status, onDelete }) => {
  const divRef = useRef<HTMLDivElement>(null)

  const [{ isDragging }, dragRef] = useDrag({
    type: 'TODO',
    item: { id, status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  useEffect(() => {
    if (divRef.current) {
      dragRef(divRef)
    }
  }, [dragRef])

  return (
    <div
      ref={ divRef }
      className={ `${styles.card} ${styles[status]}` }
      style={ { opacity: isDragging ? 0.5 : 1 } }>

      <span className={ styles.title }>{ title }</span>
      <button aria-label="Delete todo" className={ styles.deleteBtn } onClick={ () => onDelete(id) }>✕</button>
    </div>
  )
}

export default TodoCard
