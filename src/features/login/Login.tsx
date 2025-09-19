import styles from "./Login.module.scss";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import toast from "react-hot-toast";

const Login = () => {
  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("ログインに失敗しました");
      }
    }
  };
  return (
    <div className={styles.loginContainer}>
      <div className={styles.logo}>Task Flow</div>
      <p>
        Welcome back to <span>TaskFlow</span>
        <br />
        Manage your projects and tasks efficiently
      </p>
      <img
        src="web_light_rd_SU.svg"
        alt="Googleアカウントでログイン"
        onClick={signIn}
      />
    </div>
  );
};

export default Login;
