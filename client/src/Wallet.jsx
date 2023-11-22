import server from "./server";
import * as secp256k1 from "ethereum-cryptography/secp256k1";
import {toHex} from 'ethereum-cryptography/utils'
import { keccak256 } from "ethereum-cryptography/keccak";

function Wallet({ address, setAddress, balance, setBalance,privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = toHex(secp256k1.getPublicKey(privateKey))
    setAddress(address)

    if (address) {
      const {
        data: { balance },
      } = await server.get(`https://ecdsa-node-nine.vercel.app/balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        PrivateKey
        <input placeholder="Type a private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Address: {(address.slice(1)).slice(-20))}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
