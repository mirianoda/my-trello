import styles from "./List.module.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import Card from "../card/Card";
import { useAppSelector } from "../../../App/hooks";

type Props = {
  listId: string;
};

const DragOverlayList = ({ listId }: Props) => {
  const listInfo = useAppSelector((state) => state.list[listId]);

  return (
    <div className={`${styles.container} ${styles.dragging}`}>
      <div className={styles.listTitle}>
        <p>{listInfo.title}</p>
        <MoreHorizIcon />
      </div>

      {listInfo.cards.map((cardId) => (
        <Card key={cardId} cardId={cardId} listId={listId} />
      ))}

      <div className={styles.addCard}>
        <AddIcon />
        <p>カードを追加</p>
      </div>
    </div>
  );
};

export default DragOverlayList;
