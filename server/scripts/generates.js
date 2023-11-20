const {secp256k1}=require("ethereum-cryptography/secp256k1");
const {keccak256}=require("ethereum-cryptography/keccak");
const {toHex}=require("ethereum-cryptography/utils");

const privateKey=secp256k1.utils.randomPrivateKey();
console.log("PrivateKey: ",toHex(privateKey));

const publicKey=secp256k1.getPublicKey(privateKey);
console.log("PublicKey: ",toHex(publicKey));

const address=keccak256(publicKey.slice(1)).slice(-20);
console.log("Address: ",'0x'+toHex(address));
