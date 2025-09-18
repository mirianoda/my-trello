import styles from "./loading.module.scss";
import { CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d76be1ff" />
            <stop offset="100%" stopColor="#55bddaff" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
        size="4rem"
      />
    </div>
  );
};

export default Loading;
