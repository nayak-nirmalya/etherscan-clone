import React, { useEffect, useState } from "react";
import Chart from "../../public/assets/chart.png";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import axios from "axios";
import moment from "moment";
import {
  faCube,
  faGauge,
  faGlobe,
  faServer,
  faFileContract,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type BlockResult = {
  blockNumber: number;
  totalTransactions: number;
  gasUsed: number;
  miner: string;
  time: string;
};

type Transaction = {
  transactionHash: string;
  time: string;
  fromAddress: string;
  toAddress: string;
  value: string;
};

const HeroSection: React.FC = () => {
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [latestBlock, setLatestBlock] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(true);
  const [blockResult, setBlockResult] = useState<BlockResult[]>([]);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [transactionsResult, setTransactionsResult] = useState<Transaction[]>(
    []
  );

  useEffect(() => {
    const getEthPrice = async () => {
      const response = await axios.get("http://localhost:5001/getETHPrice", {});
      setEthPrice(response.data.usdPrice);
    };

    const getBlockInfo = async () => {
      const response = await axios.get(
        "http://localhost:5001/getBlockInfo",
        {}
      );

      const blockArray = [
        response.data.previousBlockInfo[1],
        response.data.previousBlockInfo[2],
        response.data.previousBlockInfo[3],
        response.data.previousBlockInfo[4],
        response.data.previousBlockInfo[5],
      ];
      setBlockResult(blockArray);

      //   const transactions = [response.data.previousBlockInfo[0].transactions];

      setTotalTransactions(
        response.data.previousBlockInfo[1].totalTransactions
      );
      setLatestBlock(response.data.latestBlock);
      setTransactionsResult(response.data.previousBlockInfo[0].transactions);
    };

    getEthPrice();
    getBlockInfo();
  }, []);

  return (
    <section className={styles.heroSectionContainer}>
      {showResult && (
        <section>
          <section className={styles.latestResults_header}>
            <section>
              <section className={styles.latestResults_box}>
                <section className={styles.svgSection}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 417"
                    preserveAspectRatio="xMidYMid"
                    className={styles.svgEth}
                  >
                    <path
                      fill="#fff"
                      d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"
                    />
                    <path
                      fill="#fff"
                      d="M127.962 0L0 212.32l127.962 75.639V154.158z"
                    />
                    <path
                      fill="#fff"
                      d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"
                    />
                    <path fill="#fff" d="M127.962 416.905v-104.72L0 236.585z" />
                    <path
                      fill="#eee"
                      d="M127.961 287.958l127.96-75.637-127.96-58.162z"
                    />
                    <path fill="#bbb" d="M0 212.32l127.96 75.638v-133.8z" />
                  </svg>
                </section>
                <section className={styles.hero_box}>
                  <p>ETHER PRICE</p>
                  <p className={styles.heroValues}>
                    ${Number(ethPrice).toFixed(2)}
                  </p>
                </section>
              </section>
              <span className={styles.divider}></span>
              <section className={styles.latestResults_box}>
                <section className={styles.svgSection}>
                  <FontAwesomeIcon icon={faGlobe} className={styles.svgIcons} />
                </section>
                <section className={styles.hero_box}>
                  <p>MARKET CAP</p>
                  <p className={styles.heroValues}>$196,968,104,207.00</p>
                </section>
              </section>
            </section>
            <section>
              <section className={styles.latestResults_box}>
                <section className={styles.svgSection}>
                  <FontAwesomeIcon
                    icon={faServer}
                    className={styles.svgIcons}
                  />
                </section>
                <section className={styles.hero_box}>
                  <p>TRANSACTIONS</p>
                  <p className={styles.heroValues}>{totalTransactions}</p>
                </section>
              </section>
              <span className={styles.divider}></span>
              <section className={styles.latestResults_box}>
                <section className={styles.svgSection}>
                  <FontAwesomeIcon icon={faGauge} className={styles.svgIcons} />
                </section>
                <section className={styles.hero_box}>
                  <p>LAST FINALIZED BLOCK</p>
                  <p className={styles.heroValues}>{latestBlock}</p>
                </section>
              </section>
            </section>
            <section>
              <section className={styles.hero_averageValue}>
                <p>Average Transaction Value</p>
                <Image src={Chart} alt="Chart" className={styles.chart} />
              </section>
            </section>
          </section>
          <section className={styles.latestResults_body}>
            <section>
              <section className={styles.latestResults_body_title}>
                Latest Blocks
              </section>
              <table className={styles.latestResults_body_table}>
                <tbody>
                  {blockResult &&
                    blockResult.map((block) => {
                      return (
                        <tr
                          className={`${styles.latestResults_body_tr} ${
                            blockResult.indexOf(block) ==
                              blockResult.length - 1 && styles.lastTd
                          }`}
                          key={block.blockNumber}
                        >
                          <td className={styles.tdIcon}>
                            <FontAwesomeIcon icon={faCube} />
                          </td>
                          <td className={styles.tdBlock}>
                            <section className={styles.blueText}>
                              {block.blockNumber}
                            </section>
                            <section>
                              {moment(block.time, "YYYYMMDD").fromNow()}
                            </section>
                          </td>
                          <td className={styles.tdTxns}>
                            <section>
                              Fee Recipient{" "}
                              <span className={styles.blueText}>
                                {block.miner.slice(0, 6)}...
                                {block.miner.slice(36)}
                              </span>
                            </section>
                            <section>
                              <span className={styles.blueText}>
                                {block.totalTransactions} txns
                              </span>
                            </section>
                          </td>
                          <td className={styles.tdValue}>
                            {block.gasUsed} Eth
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </section>
            <section>
              <section className={styles.latestResults_body_title}>
                Latest Transactions
              </section>
              <table className={styles.latestResults_body_table}>
                <tbody>
                  {transactionsResult.slice(0, 5).map((txn) => {
                    return (
                      <tr
                        className={`${styles.latestResults_body_tr} ${
                          transactionsResult.indexOf(txn) ==
                            transactionsResult.length - 1 && styles.lastTd
                        }`}
                        key={txn.transactionHash}
                      >
                        <td className={styles.tdContract}>
                          <FontAwesomeIcon
                            icon={faFileContract}
                            className={styles.tdContract}
                          />
                        </td>
                        <td className={styles.tdBlock}>
                          <section className={styles.blueText}>
                            {txn.transactionHash?.slice(0, 14)}...
                          </section>
                          <section>
                            {moment(txn.time, "YYYYMMDD").fromNow()}
                          </section>
                        </td>
                        <td className={styles.tdFromTo}>
                          <section>
                            From{" "}
                            <span className={styles.blueText}>
                              {txn.fromAddress?.slice(0, 6)}...
                              {txn.fromAddress?.slice(36)}
                            </span>
                          </section>
                          <section>
                            To{" "}
                            <span className={styles.blueText}>
                              {txn.toAddress?.slice(0, 6)}...
                              {txn.toAddress?.slice(36)}
                            </span>
                          </section>
                        </td>
                        <td className={styles.tdValue}>
                          {(Number(txn.value) / 10 ** 18).toFixed(4)} Eth
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          </section>
        </section>
      )}
    </section>
  );
};
export default HeroSection;
