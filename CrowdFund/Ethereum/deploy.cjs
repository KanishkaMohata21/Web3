const HDWalletProvider = require("@truffle/hdwallet-provider");
const {Web3} = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
    mnemonics,
    url
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    
    console.log("Attempting to deploy from account", accounts[0]);

    const balance = await web3.eth.getBalance(accounts[0]);
    console.log("Account balance:", web3.utils.fromWei(balance, 'ether'), "ETH");

    try {
        const result = await new web3.eth.Contract(compiledFactory.abi)
            .deploy({ data: compiledFactory.evm.bytecode.object })
            .send({ gas: "2000000", from: accounts[0] }); 
        
        console.log("Contract deployed to", result.options.address);
    } catch (error) {
        console.error("Error deploying contract:", error);
    } finally {
        provider.engine.stop();
    }
};

deploy();
