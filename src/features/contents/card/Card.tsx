import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../App/hooks";
import styles from "./Card.module.scss";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { removeCard } from "./cardSlice";
import { removeCardFromList } from "../list/listSlice";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  cardId: string;
  listId: string;
};

const Card = ({ cardId, listId }: Props) => {
  const cardInfo = useAppSelector((state) => state.card[cardId]);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();

  //dnd-kit
  const { listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: cardId,
      data: {
        type: "card",
        listId,
      },
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleDeleteCard = () => {
    dispatch(removeCard({ cardId }));
    dispatch(removeCardFromList({ listId, cardId }));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <p {...listeners}>{cardInfo.title}</p>
      {isHovered && (
        <HighlightOffIcon className={styles.icon} onClick={handleDeleteCard} />
      )}
    </div>
  );
};

export default Card;
