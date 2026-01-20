import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const ABI = [
  "function registerFile(bytes32,string,uint256)",
  "function verifyFile(bytes32) view returns (bool,address,string,uint256,uint256)",
];

export function getContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signerOrProvider);
}
