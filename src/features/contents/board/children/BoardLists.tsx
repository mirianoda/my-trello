import styles from "./BoardLists.module.scss";
import List from "../../list/List";
import DragOverlayList from "../../list/DragOverlayList";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useRef, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { nanoid } from "nanoid";
import { useAppDispatch, useAppSelector } from "../../../../App/hooks";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import DragOverlayCard from "../../card/DragOverlayCard";
import type { Lists } from "../../types";
import { addList, moveList } from "../../list/listThunks";
import { moveCard } from "../../card/cardThunk";
import Loading from "../../../../components/Loading ";

type Props = {
  listIds: string[];
  boardId: string;
};

const BoardLists = ({ listIds, boardId }: Props) => {
  const dispatch = useAppDispatch();
  const reduxLists = useAppSelector((state) => state.list.lists);
  const isLoading = useAppSelector((state) => state.list.isLoading);

  const [isAddListOpen, isSetAddListOpen] = useState<boolean>(false);
  const [newListTitle, setNewListTitle] = useState<string>("");
  const [localListIds, setLocalListIds] = useState<string[]>([]);
  const [localLists, setLocalLists] = useState<Lists>({});
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<{
    id: string;
    listId: string;
  } | null>(null);
  const [activeType, setActiveType] = useState<"card" | "list" | null>(null);
  const lastOverCard = useRef<{ id: string; listId: string } | null>(null);

  useEffect(() => {
    if (!isDragging) {
      setLocalListIds([...listIds]);
      setLocalLists(structuredClone(reduxLists));
    }
  }, [listIds, reduxLists]);

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();

    if (newListTitle) {
      const listId = nanoid();
      dispatch(
        addList({
          listId,
          listTitle: newListTitle,
          boardId,
          order: listIds.length,
        })
      );
      setNewListTitle("");
      isSetAddListOpen(false);
    }
  };

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId({
      id: e.active.id as string,
      listId: e.active.data.current?.listId,
    });
    setActiveType(e.active.data.current?.type || null);
    setIsDragging(true);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;

    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || !overData) return;

    const activeListId = activeData.listId;
    const overListId = overData.listId;

    if (
      activeData.type === "card" &&
      (overData.type === "card" || overData.type === "list")
    ) {
      lastOverCard.current = { id: over.id as string, listId: overListId };
      const localActiveCardIds = localLists[activeListId].cards;
      const localOverCardIds = localLists[overListId].cards;
      const fromIndex = localActiveCardIds.findIndex(
        (cardId) => cardId === active.id
      );
      const toIndex =
        overData.type === "card"
          ? localOverCardIds.findIndex((cardId) => cardId === over.id)
          : 0; //overData.type==="list"の場合（リストにタスクがない時）は、先頭に挿入

      if (fromIndex === toIndex && activeListId === overListId) return;
      let newLists = { ...localLists };

      if (activeListId === overListId) {
        let newCardIds = [...localActiveCardIds];
        const [move] = newCardIds.splice(fromIndex, 1);
        newCardIds.splice(toIndex, 0, move);

        newLists[activeListId].cards = newCardIds;
      } else {
        let newActiveCardIds = [...localActiveCardIds];
        let newOverCardIds = [...localOverCardIds];
        const [move] = newActiveCardIds.splice(fromIndex, 1);
        newOverCardIds.splice(toIndex, 0, move);

        newLists[activeListId].cards = newActiveCardIds;
        newLists[overListId].cards = newOverCardIds;
      }

      setLocalLists(newLists);
    } else if (
      activeData?.type === "list" &&
      (overData.type === "card" || overData.type === "list")
    ) {
      const fromIndex = localListIds.findIndex(
        (listIds) => listIds === activeListId
      );
      const toIndex = localListIds.findIndex(
        (listIds) => listIds === overListId
      );
      let newListIds = [...localListIds];
      const [move] = newListIds.splice(fromIndex, 1);
      newListIds.splice(toIndex, 0, move);
      setLocalListIds(newListIds);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setIsDragging(false);

    const { active, over } = e;

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || !overData) return;

    const activeListId = activeId?.listId || activeData.listId;
    const overListId = lastOverCard.current?.listId || overData.listId;

    if (
      activeData.type === "card" &&
      (overData.type === "card" || overData.type === "list")
    ) {
      const reduxActiveCardIds = reduxLists[activeListId].cards;
      const fromIndex = reduxActiveCardIds.findIndex(
        (cardId) => cardId === active.id
      );

      const toIndex =
        overData.type === "card"
          ? localLists[overListId].cards.findIndex(
              (cardId) => cardId === activeId?.id
            )
          : 0; //overData.type==="list"の場合（リストにタスクがない時）は、先頭に挿入

      if (fromIndex === toIndex && activeListId === overListId) return;
      dispatch(
        moveCard({
          fromListId: activeListId,
          toListId: overListId,
          from: fromIndex,
          to: toIndex,
        })
      );
    } else if (
      activeData.type === "list" &&
      (overData.type === "card" || overData.type === "list")
    ) {
      const fromIndex = listIds.findIndex((listId) => listId === activeListId);
      const toIndex = localListIds.findIndex(
        (listId) => listId === activeId?.id
      );
      dispatch(
        moveList({
          boardId,
          from: fromIndex,
          to: toIndex,
        })
      );
    }

    lastOverCard.current = null;
    setActiveId(null);
    setActiveType(null);
  };

  if (isLoading) return <Loading />;

  return (
    <div className={styles.container}>
      <DndContext
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={localListIds}
          strategy={horizontalListSortingStrategy}
        >
          <div className={styles.listsContainer}>
            {localListIds.map((listId) => (
              <List
                key={listId}
                listId={listId}
                boardId={boardId}
                listInfo={localLists[listId]}
              />
            ))}
          </div>
        </SortableContext>

        {/* カスタムDragOverlay */}
        <DragOverlay>
          {activeId && activeType === "list" ? (
            <DragOverlayList listId={activeId.id} />
          ) : activeId && activeType === "card" ? (
            <DragOverlayCard cardId={activeId.id} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {isAddListOpen ? (
        <div className={styles.addingList}>
          <form onSubmit={handleAddList}>
            <input
              type="text"
              value={newListTitle}
              placeholder="リスト名を入力…"
              onChange={(e) => setNewListTitle(e.target.value)}
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
              onClick={() => isSetAddListOpen(false)}
            />
          </div>
        </div>
      ) : (
        <div className={styles.addList} onClick={() => isSetAddListOpen(true)}>
          <AddIcon />
          <p>リストを追加</p>
        </div>
      )}
    </div>
  );
};

export default BoardLists;
