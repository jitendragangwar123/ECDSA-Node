const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;



app.use(cors(
  {
    origin:[""],
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
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
