const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {secp256k1}=require("ethereum-cryptography/secp256k1");
const {keccak256}=require("ethereum-cryptography/keccak");
const {toHex,utf8ToBytes}=require("ethereum-cryptography/utils");

app.use(cors(
  {
    origin:["https://ecdsa-node-front-end.vercel.app"],
    methods:["POST","GET"],
    credentials:true
  }
));
app.use(express.json());

const balances = {
  "0xa81359e9ba1a177bcea09ab8afe195c8b35bd41a": 100,
  "0x8b399a80972f9403937b50d2739bd04ca4e0c2b5": 50,
  "0xbc2cdc665bf7cd720e44fe345f5a6863584ce047": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount,signature,recovery} = req.body;

  if(!signature){
    res.status(404).send({ 
      message: "signature not provided!" 
    });
  }
  if(!recovery){
    res.status(400).send({ 
      message: "recovery not provided!" 
    });
  }

  try {
    const bytes = utf8ToBytes(JSON.stringify({ sender, recipient, amount }));
    const hash = keccak256(bytes);
    const sig = new Uint8Array(signature);
    const publicKey = secp256k1.recoverPublicKey(hash, sig, recovery);
    if(toHex(publicKey) !== sender){
      res.status(400).send({
        message: "signature not valid!" 
      });
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
  console.log(error.message)
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
