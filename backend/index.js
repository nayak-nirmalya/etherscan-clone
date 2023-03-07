const express = require("express");
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const app = express();
const Moralis = require("moralis").default;
const cors = require("cors");

require("dotenv").config({
  path: ".env",
});

const PORT = 5001;
const chain = EvmChain.ETHEREUM;
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

app.use(cors());
app.use(express.json());

app.get("/getETHPrice", async (req, res) => {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      chain,
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(400).json();
  }
});

app.get("/getBlockInfo", async (req, res) => {
  try {
    const latestBlock = await Moralis.EvmApi.block.getDateToBlock({
      date: Date.now(),
      chain,
    });

    let blockNrOrParentHash = latestBlock.toJSON().block;
    let previousBlockInfo = [];

    for (let i = 0; i < 5; i++) {
      const previousBlockNrs = await Moralis.EvmApi.block.getBlock({
        chain,
        blockNumberOrHash: blockNrOrParentHash,
      });

      blockNrOrParentHash = previousBlockNrs.toJSON().parent_hash;

      if (i === 0) {
        previousBlockInfo.push({
          transactions: previousBlockNrs.toJSON().transactions.map((i) => {
            return {
              transactionHash: i.hash,
              time: i.block_timestamp,
              fromAddress: i.from_address,
              toAddress: i.to_address,
              value: i.value,
            };
          }),
        });
      }

      previousBlockInfo.push({
        blockNumber: previousBlockNrs.toJSON().number,
        totalTransactions: previousBlockNrs.toJSON().transaction_count,
        gasUsed: previousBlockNrs.toJSON().gas_used,
        miner: previousBlockNrs.toJSON().miner,
        time: previousBlockNrs.toJSON().timestamp,
      });

      const response = {
        latestBlock: latestBlock.toJSON().block,
        previousBlockInfo,
      };

      return res.status(200).json(response);
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json();
  }
});

app.get("/address", async (req, res) => {
  try {
    const { query } = req;

    const response =
      await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
        address: query.address,
        chain,
      });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ errorMessage: "Invalid Address Provided." });
  }
});

Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(() => {
  app.listen(PORT, () => {
    console.log("Listening for API Calls...");
  });
});
