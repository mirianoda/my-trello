import { useAppSelector } from "../../../App/hooks";
import styles from "./Card.module.scss";

type Props = {
  cardId: string;
};

const DragOverlayCard = ({ cardId }: Props) => {
  const cardInfo = useAppSelector((state) => state.card.cards[cardId]);

  return (
    <div className={`${styles.container} ${styles.dragging}`}>
      <p>{cardInfo.title}</p>
    </div>
  );
};

export default DragOverlayCard;
