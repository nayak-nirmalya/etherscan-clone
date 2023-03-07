const express = require("express");
const app = express();
const Moralis = require("moralis").default();
const cors = require("cors");

require("dotenv").config({
  path: ".env",
});

const PORT = 5001;
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

app.use(cors());
app.use(express.json());

app.get("/getETHPrice", async (req, res) => {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      chainId: "0x1",
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(400).json();
  }
});

Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(() => {
  app.listen(PORT, () => {
    console.log("Listening for API Calls...");
  });
});
