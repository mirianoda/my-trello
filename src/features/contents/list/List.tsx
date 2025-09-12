import styles from "./List.module.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import Card from "../card/Card";
import { useAppDispatch, useAppSelector } from "../../../App/hooks";
import React, { useState } from "react";
import { addCardToList, removeList } from "./listSlice";
import { addCard } from "../card/cardSlice";
import { nanoid } from "nanoid";
import ClearIcon from "@mui/icons-material/Clear";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { removeListFromBoard } from "../board/boardSlice";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  listId: string;
  boardId: string;
  listInfo: {
    id: string;
    title: string;
    cards: string[];
  };
};

const List = ({ listId, boardId, listInfo }: Props) => {
  const dispatch = useAppDispatch();
  const [addingCard, setAddingCard] = useState<boolean>(false);
  const [cardTitle, setCardTitle] = useState<string>("");

  //MUI（Menuコンポーネント）
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  //dnd-kit
  const {
    listeners: listListeners,
    setNodeRef: setListNodeRef,
    transform,
    isDragging: isListDragging,
  } = useSortable({
    id: listId,
    data: {
      type: "list",
      listId,
    },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isListDragging ? 0.5 : 1,
  };
  const { setNodeRef: setDoppableRef } = useDroppable({
    id: listId,
    data: {
      type: "list",
      listId,
    },
  });

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();

    if (cardTitle) {
      const cardId = nanoid();
      dispatch(addCard({ cardId, cardTitle }));
      dispatch(addCardToList({ listId, cardId }));
      setCardTitle("");
      setAddingCard(false);
    }
  };

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleRemoveList = () => {
    dispatch(removeList({ listId }));
    dispatch(removeListFromBoard({ boardId, listId }));
  };

  return (
    <div className={styles.container} ref={setListNodeRef} style={style}>
      <div className={styles.listTitle}>
        <p {...listListeners}>{listInfo.title}</p>

        <IconButton onClick={handleOpenMenu}>
          <MoreHorizIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
          <MenuItem onClick={handleRemoveList}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="リストを削除"
              slotProps={{
                primary: {
                  sx: { fontSize: "14px", paddingRight: "5px" },
                },
              }}
            />
          </MenuItem>
        </Menu>
      </div>

      <SortableContext
        items={listInfo.cards}
        strategy={verticalListSortingStrategy}
      >
        {listInfo.cards.length === 0 && !addingCard ? (
          <div className={styles.emptyPlaceholder} ref={setDoppableRef}></div>
        ) : (
          listInfo.cards.map((cardId) => (
            <Card key={cardId} cardId={cardId} listId={listId} />
          ))
        )}
      </SortableContext>

      {addingCard && (
        <form className={styles.addCardInput} onSubmit={handleAddCard}>
          <input
            type="text"
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            placeholder="タイトルを入力…"
          />
        </form>
      )}

      {!addingCard ? (
        <div className={styles.addCard} onClick={() => setAddingCard(true)}>
          <AddIcon />
          <p>カードを追加</p>
        </div>
      ) : (
        <div className={styles.addingCard}>
          <div className={styles.addCardConfirmButton} onClick={handleAddCard}>
            カードを追加
          </div>
          <ClearIcon
            className={styles.icon}
            onClick={() => setAddingCard(false)}
          />
        </div>
      )}
    </div>
  );
};

export default List;
