import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

import styles from "@/styles/Home.module.css";
import Logo from "/assets/logo.png";

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  const [ethPrice, setEthPrice] = useState<string>("");

  useEffect(() => {
    const getEthPrice = async () => {
      const response = await axios.get("http://localhost:5001/getETHPrice", {});
      setEthPrice(response.data.usdPrice);
    };
    getEthPrice();
  }, []);

  return (
    <section className={styles.header}>
      <section className={styles.topHeader}>
        ETH Price:{" "}
        <span className={styles.blueText}>${Number(ethPrice).toFixed(2)}</span>
      </section>
    </section>
  );
};
export default Header;
