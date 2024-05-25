import Web3 from "web3";
 
window.ethereum.request({ method: "eth_requestAccounts" });
 
const web3 = new Web3(window.ethereum);
 
export default web3;

//metamask injects web3 in the browser that has all the information we need to take that
//and add it to our project