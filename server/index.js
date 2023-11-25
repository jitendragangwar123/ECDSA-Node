const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp=require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors(
  // {
  //   origin:[""],
  //   methods:["POST","GET"],
  //   credentials:true
  // }
  )
);
app.use(express.json());

const balances = {
  "0421f0bdece5569a326bfa806137b99f764100ecf44ad58e1068fb0d2cbc405d1d210442f3eafc0f8920c993d73277167601623c85ceaf4fb867dfa6a84fa78085": 100,
  "04433b6b7af2ffec984ccd8abe68401edecc1cf8430b4b7e6b3fdd6853f395bc19e5067ae587584bad894b1f493872e88714752c04b9ffdcc3bf4275de971fbc51": 50,
  "048feea4347949844ccc18c918de76fef786e92b978ff3f3350b1f1ae933340b259bece6d933bc4add5dcc4569a18781fdffb6abb0212617a47d0e4cd3589ef0ba": 95,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, recovery } = req.body;

  if (!signature) {
    res.status(404).send({ message: "signature not provided!" });
  }
  
  try {
    const bytes = utf8ToBytes(JSON.stringify({ sender, recipient, amount }));
    const hash = keccak256(bytes);
    const sig = new Uint8Array(signature);
    const publicKey = secp.recoverPublicKey(hash, sig, recovery);  

    if (toHex(publicKey) !== sender) {
      res.status(400).send({ message: "signature not valid" });
    }

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}


