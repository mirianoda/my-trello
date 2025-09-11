import styles from "./BoardTitle.module.scss";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

type Props = {
  boardTitle: string;
};

const BoardTitle = ({ boardTitle }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <LeaderboardIcon className={styles.icon} />
        <KeyboardArrowDownIcon className={styles.icon} />
      </div>

      <div className={styles.title}>{boardTitle}</div>

      <div className={styles.iconContainer}>
        <StarOutlineIcon className={`${styles.icon} ${styles.star}`} />
      </div>
    </div>
  );
};

export default BoardTitle;
