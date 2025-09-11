import styles from "./Sidebar.module.scss";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <KeyboardDoubleArrowRightIcon className={styles.icon} />
    </div>
  );
};

export default Sidebar;
