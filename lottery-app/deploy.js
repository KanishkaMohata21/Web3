const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { compiledContent } = require('./compile.cjs'); 

const provider = new HDWalletProvider(
    'mnemonics',
    'url'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts(); 
    console.log(accounts);

    const result = await new web3.eth.Contract(JSON.parse(compiledContent.interface))
        .deploy({
            data: compiledContent.bytecode,
        })
        .send({ gas: '1000000', from: accounts[0] });
    console.log(compiledContent.interface)
    console.log('address at',result.options.address);
    provider.engine.stop();
};

deploy();
