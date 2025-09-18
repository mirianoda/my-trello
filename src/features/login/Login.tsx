import React from "react";
import styles from "./Login.module.scss";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";

const Login = () => {
  const signIn = () => {
    signInWithPopup(auth, provider).catch((err) => {
      alert(err.message);
    });
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
