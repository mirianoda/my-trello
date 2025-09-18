import styles from "./Header.module.scss";
import AppsIcon from "@mui/icons-material/Apps";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { Avatar } from "@mui/material";
import { useAppSelector } from "../../App/hooks";

const Header = () => {
  const user = useAppSelector((state) => state.user.user);

  return (
    <div className={styles.headerContainer}>
      {/* iconsLeft */}
      <div className={styles.iconsLeft}>
        <div className={styles.iconContainer}>
          <AppsIcon className={styles.icon} />
        </div>
        <div className={styles.iconContainer}>
          <HomeFilledIcon className={styles.icon} />
        </div>
        <form>
          <div className={styles.searchBox}>
            <input type="text" />
            <SearchIcon className={styles.icon} />
            <button type="submit"></button>
          </div>
        </form>
      </div>

      {/* logo */}
      <div className={styles.logo}>
        <p>Task Flow</p>
      </div>

      {/* iconsRight */}
      <div className={styles.iconsRight}>
        <div className={styles.iconContainer}>
          <AddIcon className={styles.icon} />
        </div>
        <div className={styles.iconContainer}>
          <InfoOutlineIcon className={styles.icon} />
        </div>
        <div className={styles.iconContainer}>
          <NotificationsNoneIcon className={styles.icon} />
        </div>
        <Avatar className={styles.avatar} src={user?.photo} />
      </div>
    </div>
  );
};

export default Header;
