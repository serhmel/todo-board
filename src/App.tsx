import Board from "./components/Board/Board.tsx"
import Header from "./components/Header/Header.tsx"
import styles from "./App.module.css"


function App() {
  return (
    <div className={ styles.app }>
      <Header />
      <Board />
    </div>
  )
}

export default App
