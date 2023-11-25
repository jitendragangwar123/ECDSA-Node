const secp=require("ethereum-cryptography/secp256k1");
const {keccak256}=require("ethereum-cryptography/keccak");
const {toHex}=require("ethereum-cryptography/utils");

const privateKey=secp.utils.randomPrivateKey();
console.log("PrivateKey: ",toHex(privateKey));

const publicKey=secp.getPublicKey(privateKey);
console.log("PublicKey: ",toHex(publicKey));

const address=keccak256(publicKey.slice(1)).slice(-20);
console.log("Address: ",'0x'+toHex(address));


/*
PrivateKey:  fd386b31ba6f4a957f5726804973a1560b80347b97f696e1eb56429249af1115
PublicKey:  0421f0bdece5569a326bfa806137b99f764100ecf44ad58e1068fb0d2cbc405d1d210442f3eafc0f8920c993d73277167601623c85ceaf4fb867dfa6a84fa78085
Address:  0x27cf128e8784c64efb66c365729013f4f18b1c5e


PrivateKey:  9fa9d1a03f8c4f3a85fea2495ca6634a7656e7f12c296fff51e216557750c556
PublicKey:  04433b6b7af2ffec984ccd8abe68401edecc1cf8430b4b7e6b3fdd6853f395bc19e5067ae587584bad894b1f493872e88714752c04b9ffdcc3bf4275de971fbc51
Address:  0x0ff5c14a567891175213a3057cea3cd727c01d4e


PrivateKey:  05c727c0fc1a7328a23a24558d70ae706edc716f87cfaa52b67a21103b5bf631
PublicKey:  048feea4347949844ccc18c918de76fef786e92b978ff3f3350b1f1ae933340b259bece6d933bc4add5dcc4569a18781fdffb6abb0212617a47d0e4cd3589ef0ba
Address:  0x2fd1d90e858a27118e3f16284e5d64f1a920d909
*/