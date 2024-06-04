import web3 from "../Ethereum/web3";
import campaignFactory from './build/CampaignFactory.json'

console.log(campaignFactory.abi)
const instance = new web3.eth.Contract(
    campaignFactory.abi,
  '0x2F638cb6ee4DE46Bf58B36b7F9a80a1128E1ECCa'
);

export default instance;