import React, { useEffect, useRef, useState } from "react"
import { useDrop } from "react-dnd"
import cn from "classnames"

import TodoCard from "../TodoCard/TodoCard"
import styles from "./Column.module.css"
import type { Todo, TodoStatus } from "../../features/todos/types.ts"

interface ColumnProps {
    title: string;
    icon: React.ReactNode;
    cards: Todo[];
    status: TodoStatus;
    moveCard: (id: string, fromStatus: TodoStatus, toStatus: TodoStatus) => void;
    onDelete: (id: string) => void;
}

const Column: React.FC<ColumnProps> = ({ title, icon, cards, status, moveCard, onDelete }) => {
  const divRef = useRef<HTMLDivElement>(null)

  const [isOver, setIsOver] = useState(false)

  const [, dropRef] = useDrop({
    accept: 'TODO',
    drop: (item: { id: string; status: TodoStatus }) => moveCard(item.id, item.status, status),
    collect: (monitor) => setIsOver(monitor.isOver()),
  })

  useEffect(() => {
    if (divRef.current) {
      dropRef(divRef)
    }
  }, [dropRef])

  return (
    <div ref={ divRef } className={ cn(styles.column, { [styles.columnOver]: isOver }) }>
      <h2 className={ styles.columnTitle }>
        { title } { icon }
      </h2>
      <div className={ styles.cards }>
        { cards.map((card) => (
          <TodoCard key={ card.id } { ...card } onDelete={ onDelete }/>
        )) }
      </div>
    </div>
  )
}

export default Column
