import styles from "./Sidebar.module.scss";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { useAppDispatch, useAppSelector } from "../../App/hooks";
import React, { useState } from "react";
import { addBoard } from "../contents/board/boardThunks";
import { nanoid } from "nanoid";
import { selectBoard } from "../../App/sessionSlice";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const reduxBoards = useAppSelector((state) => state.board.boards);
  const recentBoardIds = Object.values(reduxBoards)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .map((board) => board.id);
  const currentBoardId =
    useAppSelector((state) => state.session.currentBoardId) ||
    recentBoardIds[0];
  const [isAddBoardOpen, setisAddBoardOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [newBoardTitle, setNewBoardTitle] = useState<string>("");

  const handleAddBoard = (e: React.FormEvent) => {
    e.preventDefault();
    const newBoardId = nanoid();
    dispatch(addBoard({ boardId: newBoardId, boardTitle: newBoardTitle }));
    dispatch(selectBoard({ boardId: newBoardId }));
    setNewBoardTitle("");
    setisAddBoardOpen(false);
  };

  return (
    <div
      className={`${styles.sidebar} ${
        isHovered ? styles.expanded : styles.closed
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? (
        <>
          <KeyboardDoubleArrowLeftIcon />
          <div className={styles.sidebarMenu}>
            <KeyboardArrowDownIcon className={styles.smallIcon} />
            <p>Boards</p>
            {!isAddBoardOpen && (
              <AddIcon
                className={styles.icon}
                onClick={() => setisAddBoardOpen(true)}
              />
            )}
          </div>
          <div className={styles.boardList}>
            {isAddBoardOpen && (
              <>
                <form
                  className={styles.addBoardInput}
                  onSubmit={handleAddBoard}
                >
                  <input
                    type="text"
                    placeholder="ボード名を入力…"
                    value={newBoardTitle}
                    onChange={(e) => setNewBoardTitle(e.target.value)}
                  />
                </form>
                <div className={styles.addingBoard}>
                  <div
                    className={styles.addBoardConfirmButton}
                    onClick={handleAddBoard}
                  >
                    カードを追加
                  </div>
                  <ClearIcon
                    className={styles.icon}
                    onClick={() => setisAddBoardOpen(false)}
                  />
                </div>
              </>
            )}

            {recentBoardIds.map((key) => (
              <div
                key={key}
                className={`${styles.boardTitle} ${
                  currentBoardId === key ? styles.selected : ""
                }`}
                onClick={() => dispatch(selectBoard({ boardId: key }))}
              >
                <p>{reduxBoards[key].title}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <KeyboardDoubleArrowRightIcon className={styles.icon} />
      )}
    </div>
  );
};

export default Sidebar;
