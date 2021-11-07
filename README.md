explain
Recently, in the development of Ethereum smart contract DAPP, we encountered many problems when using PHP as the interface, which can be recorded as a reference. The operating environment of this article is Mac, which has been installedtruffle/ganacheAnd other development tools

Writing smart contracts
New truffle project

mkdir test_truffle
cd test_truffle
truffle init
Create a new hello_ Falco contract and compile
Enter the contracts directory and create a new hello_ falco.sol
pragma solidity ^0.4.17;
 
contract Hello_falco {
 
  function say() public pure returns (string) {
    return "Hello falco";
  }
 
  function print(string name) public pure returns (string) {
    return name;
  }
}
implementtruffle compilecommand
Using PHP to deploy Ethereum smart contract to develop DAPP

You can see hello_ Falco. Sol the contract has been compiled
All the compiled contracts will generate a JSON file under build / contracts and open the generated hello_ Falco. JSON file, you can see theabi,bytecodeAnd other information, which will be used in the future

Deploy contracts to Ganache
to configuretruffle.js

module.exports = {
    networks: {
        development: {
          host: "127.0.0.1",
          Port: 9545, // my local Ganache port
          network_id: "*"
        }
    }
};
implementtruffle migrate --resetcommand
Using PHP to deploy Ethereum smart contract to develop DAPP

The contract has been migrated. It will consume part of eth in the main account. You can see that the account balance has changed
Using PHP to deploy Ethereum smart contract to develop DAPP

Test contract
implementtruffle console, open the console

truffle(development)> var contract;
undefined
truffle(development)> Hello_falco.deployed().then(function(instance){contract= instance;});
undefined
truffle(development)> contract.say();
'Hello falco'
Using PHP + laravel to deploy contracts
The above is to deploy and test the contract using truffle. Next, we will deploy it again using PHP to operate Web3

Install composer package
composer require jcsofts/laravel-ethereum
Detailed installation instructionsLaravel ethereum

to configure.envfile

ETH_HOST=http://127.0.0.1
ETH_PORT=9545
Write PHP deployment contract method
use Jcsofts\LaravelEthereum\Facade\Ethereum;
use Jcsofts\LaravelEthereum\Lib\EthereumTransaction;

   private $mainAddress = "0x80d2F5BA14983a671e29068958Eb60a45b01e49c";

   public function deploy(){
       $byteCode = "xxx";
       $ethereumTransaction = new EthereumTransaction(
           $this->mainAddress,null,null,'0x47b760',null,$byteCode);
       $response = Ethereum::eth_sendTransaction($ethereumTransaction);
       dd($response);
   }
The main account address is Ganache’s first account address
Bytecode of smart contract uses compiled hello_ Bytecode section in falco.json
0x47b760For gas, I set a fixed value for testing

After the deploy method is executed, we print out the response

0x0ca011fd3856b34ee5169ec0c0ddad465f5e6bec1795751b41bbab9e295ac0a0
This is a transactionhash. Later, we will use it to get the deployed contract address

    public function receipt(){
        $hash = "0x0ca011fd3856b34ee5169ec0c0ddad465f5e6bec1795751b41bbab9e295ac0a0";
        $response = Ethereum::eth_getTransactionReceipt($hash);
        dd($response);
    }
Using PHP to deploy Ethereum smart contract to develop DAPP
As shown in the figure, after we get the contract address, we can execute the method body defined in the smart contract through the contract address above

PHP calls say method in smart contract
To access a method in a contract, we first need to obtain the function signature of the method, so how to obtain the method signature?

1. Entertruffle consoleConsole
2. Through the Sha3 method of Web3

truffle(development)> web3.sha3("say()")
'0x954ab4b21481711a1e363afa5d2b9003ed2702949b83f2d36d03d3b90ebb0f26'
truffle(development)> web3.sha3("say()").substr(2,8)
'954ab4b2'
You just need to get to the top eight
Continue to write the say method PHP function

    public function say(){
        $contractAddress = "0x00a800ff57861294dd3db449dbe0367ae66d9e86";
        $ethereumTransaction = new EthereumTransaction(
            $this->mainAddress,$contractAddress,null,'0x47b760',null,'0x954ab4b2');
        $response =  Ethereum::eth_sendTransaction($ethereumTransaction);
        dd($response);
    }
After execution, we get a list of transactionhashes
If everything is normal, a new block will appear in our Ganache log, and the transactionhash returned by PHP is the hash of this block
Using PHP to deploy Ethereum smart contract to develop DAPP
If there is an error or the method does not exist, the following will happen
Using PHP to deploy Ethereum smart contract to develop DAPP

