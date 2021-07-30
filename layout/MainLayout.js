import React from "react";
import styles from "../styles/mainlayout.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import moment from "moment-business-days";
import { Menu } from "antd";
const { SubMenu } = Menu;

export default function MainLayout({ children }) {
  const router = useRouter();
  const { adresse, promise_date, name } = router.query;
  const handleClick = (e) => {
    alert("changement de langue");
  };
  return (
    <>
      <header className={styles.Header}>
        <div className={styles.logo}>
          <Link href="/">
            <a>
              <Image
                src="/logo-JW.png"
                alt="logo jeld wen"
                width={220}
                height={40}
              />
            </a>
          </Link>
        </div>

        <h1 className={styles.HeaderTitle}>Planning réception</h1>

        <div>TODO CHOOSE LANGAGE</div>

        {adresse && promise_date && (
          <div className={styles.deliveryInformations}>
            <p style={{ textAlign: "center", width: "90%", margin: "auto" }}>
              Lieu de livraison : {adresse}
            </p>

            <p>{name}</p>
            <p style={{ textAlign: "center" }}>
              Date de livraison prévue :
              {moment(promise_date).format("DD MMMM YYYY")}
            </p>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer
        style={{
          position: "relative",
          bottom: 0,
          width: "100%",
          backgroundColor: "red",
          height: "50px",
        }}
      >
        Jeld wen inc
      </footer>
    </>
  );
}
