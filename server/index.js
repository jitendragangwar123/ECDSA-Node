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
  "034f92a829374f8860987d3b5a184e57e9c5a9959fae822c746dfcba190409aaa0": 100,
  "0350b6ec210cb674c478b9d2a0a4f480d16e2facb359ffcac058e362068bc5566f": 50,
  "0203045871c1b42722f8a5d7a459e428ddcca29ec5ac9607d963d6731b05d6cc51": 75,
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
