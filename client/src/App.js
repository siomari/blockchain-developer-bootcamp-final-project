import Web3 from "web3";
import React, { Component } from "react";
import NFTulips from "./contracts/NFTulips.json";
import getWeb3 from "./getWeb3";

import NFTRow from "./components/NFTRow";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      const web3socket = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'))

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = NFTulips.networks[networkId];
      const instance = new web3.eth.Contract(
        NFTulips.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const socketInstance = new web3socket.eth.Contract(
        NFTulips.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.

      const currentSupply = parseInt(await instance.methods.currentSupply().call())
      const price = parseFloat(await instance.methods.getPrice().call())
      console.log(price)
      const maxmint = parseInt(await instance.methods.getMaxMintable().call())
      let li = parseInt(await instance.methods.getLikes().call())

      let response = await fetch('https://api.unsplash.com/search/photos?query=london&per_page=1&client_id=9c6PMXMx2o4LmvwoJzhtFbebOyAzsHrYh3eJtQC4GiY')
      let data = await response.json()

      const imageURL = data.results[0].urls.small
      const likes = data.results[0].likes

      this.setState({ web3, accounts, contract: instance, currentSupply, price, imageURL, likes, maxmint});

      console.log(this.state.likes)
      const component = this


      socketInstance.events.Transfer({
        fromBlock: 0
      }, function (error, event){
        if (error) console.log(error)
        // console.log(event.returnValues.tokenId)
        let tokenId = event.returnValues.tokenId
        if (parseInt(tokenId) > parseInt(currentSupply))
          component.setState({ currentSupply: tokenId })

      })  
      
      socketInstance.events.UpdateState({
        fromBlock: 0
      }, function (error, event){
        if (error) console.log(error)
        // console.log(event.returnValues.tokenId)
        let p = event.returnValues._price
        let m = event.returnValues._maxMintable
        let l = event.returnValues._likes
        if (parseInt(p) > parseInt(price))
          component.setState({ price: p })
        if (parseInt(m) < parseInt(maxmint))
          component.setState({ maxmint: m })
        if (parseInt(l) > parseInt(likes))
          component.setState({ likes: l })
      }) 
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  async mintNFT(e) {
    e.preventDefault()

    const{accounts, contract, web3, price, likes} = this.state
    await contract.methods.updateState(likes).send({
      from: accounts[0]
    })

    let p = parseFloat(await contract.methods.getPrice().call())


    await contract.methods.purchase().send({
      from: accounts[0],
      value: web3.utils.toWei(String(p), 'ether')
    })
  }

  nftIDs() {
    let ids =  [...Array(parseInt(this.state.currentSupply) + 1).keys()]
    ids.shift()
    return ids
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="container align-items-center">
        <h1 className="font-weight-light">NFTulips</h1>
        <p>Current supply: {this.state.currentSupply}</p>
        <p>Likes: {this.state.likes}</p>
        <p>Max Supply: {this.state.maxmint}</p>
        <p>Price: {this.state.price}</p>
        <img src={this.state.imageURL} width='250px' height = '250px' />
        <div>
        <button className="btn btn-primary my-8" onClick={this.mintNFT.bind(this)}>Mint</button> 

        </div>
        <br />
        <table>
          <thead>
            <tr>
              <th>
                Token ID
              </th>
              <th>
                Owner Address
              </th>
            </tr>
          </thead>
          <tbody>
            {this.nftIDs().map((id) => <NFTRow id={id} key={id} contract={this.state.contract} />)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
