# blockchain-developer-bootcamp-final-project

ConsenSys Academy Final Project 2021

## NFTulips

A dapp that aims to give value to content created by 'influencers' on social media. The creators will have the opportunity to sell their instagram pictures as NFTs.

By using chainlink the dapp will be able to access real wolrd data from a social media platform e.g.Instagram. The content produced by the user using our dapp, could be sold as an NFT. 

NFT creation and mining will be dependent to the virality of the post. In particular, the numbers of the NFT available will decrease depending on the likes that the post have received over some predefined periods of time or reaction ammount.

## Project Structure
* client: The front-end application implemented with ReactJs and by using the web3.js library in js
* contracts: Contains the contract
* test: The unit test of the contract.

## How to run the project locally

Due to time limitations, I didn't manage to deploy my contract to a testnet or upload the interface to a hosting server. It is only deployed and tested locally.

### Preresquities

* npm : 6.14.15
* nodejs : 12.22.8
* ganache : 2.5.4
* Truffle : 5.4.23
* solidity : 0.8.0
* web3js : 1.5.3

### Contract deployment

You sould have truffle and ganache installed. Ganache should run.

Clone the project and run ```truffle deploy```. 

### Frontend deployment

For the frontend deployment

```cd client```

```npm install```

```npm start```

Open http://localhost:3000/
and connect Metamask to the network that contract was deployed

## Tests

Run 
```truffle test```

## Video


## Public Ethereum Account
0xFBf2fca79AFCCbbA5A599Bba20Ff3C48e046EeA7