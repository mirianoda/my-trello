import styles from "./Header.module.scss";
import AppsIcon from "@mui/icons-material/Apps";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { useAppSelector } from "../../App/hooks";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Header = () => {
  const user = useAppSelector((state) => state.user.user);
  //MUI（Menuコンポーネント）
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    try {
      signOut(auth);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("ログインに失敗しました");
      }
    }
  };

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
        <div className={styles.menuContainer}>
          <Tooltip title="アカウント">
            <IconButton
              onClick={handleOpenMenu}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar className={styles.avatar} src={user?.photo} />
            </IconButton>
          </Tooltip>

          <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
            <ListItem>
              <ListItemText
                primary="アカウント"
                slotProps={{
                  primary: {
                    sx: { fontSize: "13px", paddingRight: "5px" },
                  },
                }}
              />
            </ListItem>
            <ListItem>
              <Avatar className={styles.menuAvatar} src={user?.photo} />
              <div className={styles.accountInfo}>
                <p className={styles.name}>{user?.displayName}</p>
                <p className={styles.email}>{user?.email}</p>
              </div>
            </ListItem>
            <Divider />
            <MenuItem onClick={handleLogout} className={styles.logoutBtn}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="ログアウト"
                slotProps={{
                  primary: {
                    sx: { fontSize: "13px", paddingRight: "5px" },
                  },
                }}
              />
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Header;
