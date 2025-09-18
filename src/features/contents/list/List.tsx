import styles from "./List.module.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import Card from "../card/Card";
import { useAppDispatch } from "../../../App/hooks";
import React, { useState } from "react";
import { addCard } from "../card/cardThunk";
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
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { removeList } from "./listThunks";

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
  const [isAddCardOpen, setIsAddCardOpen] = useState<boolean>(false);
  const [newCardTitle, setNewCardTitle] = useState<string>("");

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

    if (newCardTitle) {
      const cardId = nanoid();
      dispatch(
        addCard({
          cardId,
          cardTitle: newCardTitle,
          listId,
          order: listInfo.cards.length,
        })
      );
      setNewCardTitle("");
      setIsAddCardOpen(false);
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
    dispatch(removeList({ listId, boardId }));
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
        {listInfo.cards.length === 0 && !isAddCardOpen ? (
          <div className={styles.emptyPlaceholder} ref={setDoppableRef}></div>
        ) : (
          listInfo.cards.map((cardId) => (
            <Card key={cardId} cardId={cardId} listId={listId} />
          ))
        )}
      </SortableContext>

      {isAddCardOpen && (
        <form className={styles.addCardInput} onSubmit={handleAddCard}>
          <input
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="タイトルを入力…"
          />
        </form>
      )}

      {!isAddCardOpen ? (
        <div className={styles.addCard} onClick={() => setIsAddCardOpen(true)}>
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
            onClick={() => setIsAddCardOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default List;
