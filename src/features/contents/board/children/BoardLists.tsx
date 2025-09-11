import styles from "./BoardLists.module.scss";
import List from "../../list/List";
import DragOverlayList from "../../list/DragOverlayList";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { nanoid } from "nanoid";
import { useAppDispatch, useAppSelector } from "../../../../App/hooks";
import { addList, moveCardIds } from "../../list/listSlice";
import { addListToBoard, moveListIds } from "../boardSlice";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import DragOverlayCard from "../../card/DragOverlayCard";

type Props = {
  listIds: string[];
  boardId: string;
};

const BoardLists = ({ listIds, boardId }: Props) => {
  const dispatch = useAppDispatch();
  const [addingList, setAddingList] = useState<boolean>(false);
  const [listTitle, setListTitle] = useState<string>("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"card" | "list" | null>(null);
  const lists = useAppSelector((state) => state.list);

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();

    if (listTitle) {
      const listId = nanoid();
      dispatch(addList({ listId, listTitle }));
      dispatch(addListToBoard({ boardId, listId }));
      setListTitle("");
      setAddingList(false);
    }
  };

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
    setActiveType(e.active.data.current?.type || null);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;

    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!overData) return;

    if (
      activeData?.type === "card" &&
      (overData.type === "card" || overData.type === "list")
    ) {
      const activeListId = activeData.listId;
      const overListId = overData.listId as string;

      const cardIds = lists[activeListId].cards;
      const fromIndex = cardIds.findIndex((cardId) => cardId === active.id);
      const toIndex =
        overData.type === "card"
          ? cardIds.findIndex((cardId) => cardId === over.id)
          : 0; //overData.type==="list"の場合（リストにタスクがない時）は、先頭に挿入

      if (fromIndex === toIndex && activeListId === overListId) return;

      dispatch(
        moveCardIds({
          fromListId: activeListId,
          toListId: overListId,
          from: fromIndex,
          to: toIndex,
        })
      );
    } else if (activeData?.type === "list") {
      console.log(over.id, overData.type, overData.listId);
      dispatch(
        moveListIds({
          boardId,
          from: listIds.findIndex((listId) => listId === active.id),
          to: listIds.findIndex((listId) => listId === overData.listId),
        })
      );
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    setActiveType(null);

    const { active, over } = e;

    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!overData) return;

    if (
      activeData?.type === "card" &&
      (overData.type === "card" || overData.type === "list")
    ) {
      // const activeListId = activeData.listId;
      // const overListId = overData.listId as string;
      // const cardIds = lists[activeListId].cards;
      // const fromIndex = cardIds.findIndex((cardId) => cardId === active.id);
      // const toIndex =
      //   overData.type === "card"
      //     ? cardIds.findIndex((cardId) => cardId === over.id)
      //     : 0; //overData.type==="list"の場合（リストにタスクがない時）は、先頭に挿入
      // if (fromIndex === toIndex && activeListId === overListId) return;
      // dispatch(
      //   moveCardIds({
      //     fromListId: activeListId,
      //     toListId: overListId,
      //     from: fromIndex,
      //     to: toIndex,
      //   })
      // );
    } else if (activeData?.type === "list") {
      // const fromIndex = listIds.findIndex((listId) => listId === active.id);
      // const toIndex = listIds.findIndex((listId) => listId === overData.listId);
      // console.log(
      //   "Drop:" + over.id,
      //   overData.type,
      //   overData.listId,
      //   fromIndex,
      //   toIndex
      // );
      // dispatch(
      //   moveListIds({
      //     boardId,
      //     from: fromIndex,
      //     to: toIndex,
      //   })
      // );
    }
  };

  return (
    <div className={styles.container}>
      <DndContext
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={listIds}
          strategy={horizontalListSortingStrategy}
        >
          <div className={styles.listsContainer}>
            {listIds.map((listId) => (
              <List key={listId} listId={listId} boardId={boardId} />
            ))}
          </div>
        </SortableContext>

        {/* カスタムDragOverlay */}
        <DragOverlay>
          {activeId && activeType === "list" ? (
            <DragOverlayList listId={activeId} />
          ) : activeId && activeType === "card" ? (
            <DragOverlayCard cardId={activeId} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {addingList ? (
        <div className={styles.addingList}>
          <form onSubmit={handleAddList}>
            <input
              type="text"
              value={listTitle}
              placeholder="リスト名を入力…"
              onChange={(e) => setListTitle(e.target.value)}
            />
          </form>
          <div className={styles.addingListButtons}>
            <div
              className={styles.addListConfirmButton}
              onClick={handleAddList}
            >
              リストを追加
            </div>
            <ClearIcon
              className={styles.icon}
              onClick={() => setAddingList(false)}
            />
          </div>
        </div>
      ) : (
        <div className={styles.addList} onClick={() => setAddingList(true)}>
          <AddIcon />
          <p>もう1つリストを追加</p>
        </div>
      )}
    </div>
  );
};

export default BoardLists;
