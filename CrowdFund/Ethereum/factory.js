import web3 from "../Ethereum/web3";
import campaignFactory from './build/CampaignFactory.json'

console.log(campaignFactory.abi)
const instance = new web3.eth.Contract(
    campaignFactory.abi,
      address
);

export default instance;
