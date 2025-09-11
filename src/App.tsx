import Board from "./features/contents/board/Board";
import Header from "./features/header/Header";
import Sidebar from "./features/sidebar/Sidebar";
import style from "./App.module.scss";

function App() {
  return (
    <div className={style.layout}>
      {/* ヘッダー */}
      <Header />

      <div className={style.main}>
        {/* サイドバー */}
        <Sidebar />

        {/* ボード */}
        <Board />
      </div>
    </div>
  );
}

export default App;
