import styles from "./BoardTitle.module.scss";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
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
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
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

      <div
        className={`${styles.iconContainer} ${styles.addPersonButton}`}
        onClick={() => setIsOpenModal(true)}
      >
        <PersonAddIcon className={styles.icon} />
        <p>共有する</p>
      </div>
      <Modal open={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" component="h4">
            テストモーダル
          </Typography>
          <Button variant="contained" onClick={() => setIsOpenModal(false)}>
            閉じる
          </Button>
        </Box>
      </Modal>

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
