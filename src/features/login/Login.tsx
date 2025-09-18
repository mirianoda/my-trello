import React from "react";
import styles from "./Login.module.scss";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";

const Login = () => {
  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("ログインに失敗しました");
      }
    }
  };
  return (
    <div className={styles.loginContainer}>
      <div className={styles.logo}>T</div>
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
