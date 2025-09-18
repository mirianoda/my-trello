import { useAppDispatch, useAppSelector } from "../../../App/hooks";
import { selectBoard } from "../../../App/slices/sessionSlice";
import Loading from "../../../components/Loading ";
import styles from "./Board.module.scss";
import BoardLists from "./children/BoardLists";
import BoardTitle from "./children/BoardTitle";

const Board = () => {
  const dispatch = useAppDispatch();
  const reduxBoards = useAppSelector((state) => state.board.boards);
  const isLoading = useAppSelector((state) => state.board.isLoading);
  const currentBoardIdFromSession = useAppSelector(
    (state) => state.session.currentBoardId
  );

  const recentBoardIds = Object.values(reduxBoards)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .map((board) => board.id);
  const currentBoardId = currentBoardIdFromSession || recentBoardIds[0];
  const boardInfo = reduxBoards[currentBoardId];

  if (isLoading) return <Loading />;

  if (!boardInfo) {
    if (recentBoardIds[0]) {
      dispatch(selectBoard({ boardId: recentBoardIds[0] }));
    }
    return (
      <div className={styles.emptyBoard}>
        <img src="/bow-cat.png" alt="" />
        <h2>No boards yet</h2>
        <p>Create a new board from the sidebar to get started!</p>
      </div>
    );
  }

  return (
    <div className={styles.boardContainer}>
      {/* boardTitle */}
      <BoardTitle boardId={boardInfo.id} boardTitle={boardInfo.title} />
      {/* boardLists */}
      <BoardLists boardId={boardInfo.id} listIds={boardInfo.lists} />
    </div>
  );
};

export default Board;
