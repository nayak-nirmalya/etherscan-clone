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

  return <div>Have a good coding</div>;
};
export default Header;
