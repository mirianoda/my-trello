import { useAppSelector } from "../../../App/hooks";
import styles from "./Board.module.scss";
import { exampleBoardId } from "./boardSlice";
import BoardLists from "./children/BoardLists";
import BoardTitle from "./children/BoardTitle";

const Board = () => {
  const boards = useAppSelector((state) => state.board);
  const boardInfo = boards[exampleBoardId];

  return (
    <div className={styles.boardContainer}>
      {/* boardTitle */}
      <BoardTitle boardTitle={boardInfo.title} />
      {/* boardLists */}
      <BoardLists boardId={exampleBoardId} listIds={boardInfo.lists} />
    </div>
  );
};

export default Board;
