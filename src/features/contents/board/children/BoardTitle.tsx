import styles from "./BoardTitle.module.scss";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { useState } from "react";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch } from "../../../../App/hooks";
import { removeBoard } from "../boardThunks";

type Props = {
  boardId: string;
  boardTitle: string;
};

const BoardTitle = ({ boardId, boardTitle }: Props) => {
  const dispatch = useAppDispatch();
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

  const handleRemoveBoard = () => {
    dispatch(removeBoard({ boardId }));
    setAnchorEl(null);
  };

  return (
    <div className={styles.boardTitleContainer}>
      <div className={styles.iconContainer}>
        <LeaderboardIcon className={styles.icon} />
        <KeyboardArrowDownIcon className={styles.icon} />
      </div>

      <div className={styles.title}>{boardTitle}</div>

      <div className={styles.iconContainer}>
        <StarOutlineIcon className={`${styles.icon} ${styles.star}`} />
      </div>

      <div className={styles.menuContainer}>
        <IconButton onClick={handleOpenMenu}>
          <MoreHorizIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
          <MenuItem onClick={handleRemoveBoard}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="ボードを削除"
              slotProps={{
                primary: {
                  sx: { fontSize: "14px", paddingRight: "5px" },
                },
              }}
            />
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default BoardTitle;
