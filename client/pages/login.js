import { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";

import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

const LOGIN = gql`
  query login($email: String!, $password: String!) {
    login(user: { email: $email, password: $password }) {
      user {
        _id
        username
        email
      }
      token
    }
  }
`;

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { loading, data, error }] = useLazyQuery(LOGIN);

  const submitLoginForm = (e) => {
    e.preventDefault();
    login({ variables: { email, password } });
  };

  if (loading) return <h1>Logging In...</h1>;

  if (data) {
    console.log(data);
    localStorage.setItem("userId", data.login.user._id);
    localStorage.setItem("auth_token", data.login.token);
    if (typeof window !== "undefined") router.push("/");
  }

  if (typeof window !== "undefined" && localStorage.getItem("auth_token")) {
    router.push("/profile");
  }

  return (
    <div className={styles.container}>
      {error && <h1>{error.message}</h1>}
      <form onSubmit={submitLoginForm}>
        <div className={styles.formContainer}>
          Email:{" "}
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formContainer}>
          Password:{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className={styles.formButton} type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
