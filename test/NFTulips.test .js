const truffleAssert = require('truffle-assertions')
const NFTulips = artifacts.require("./NFTulips.sol")

contract("NFTulips", accounts => {
    it("allows a person to purchase 1 NFT", async ()=>{

        let contract_owner = accounts[0]
        let buyer = accounts[8]
        tulip = await NFTulips.deployed()


        let starting_balance = await web3.eth.getBalance(contract_owner)
        starting_balance = parseFloat(web3.utils.fromWei(starting_balance, 'ether'))

        // console.log("STARTING: ", starting_balance)


        await tulip.purchase( {
            from: buyer,
            value: web3.utils.toWei('1', 'ether')
        })

        owner = await tulip.ownerOf(1)
        assert.equal(owner, buyer)

        token_uri = await tulip.tokenURI(1)
        assert.equal(token_uri, 'https://api.unsplash.com/photos/1')

        let ending_balance = await web3.eth.getBalance(contract_owner)
        ending_balance = parseFloat(web3.utils.fromWei(ending_balance, 'ether'))
        console.log("ENDING: ", ending_balance)

        assert.isAbove(ending_balance, starting_balance + 0.9)
        assert.isBelow(ending_balance, starting_balance + 1.1)
    })

    it("doesn't allow more than the max supply", async () => {
        let tulip = await NFTulips.new()

        let contract_owner = accounts[0]
        let buyer = accounts[7]

        let starting_balance = await web3.eth.getBalance(contract_owner)
        starting_balance = parseFloat(web3.utils.fromWei(starting_balance, 'ether'))

        console.log("STARTING: ", starting_balance)

        for(let i=0;i<19;i++){
            await tulip.purchase({
                from: buyer,
                value: web3.utils.toWei('1', 'ether')
            })
        }
        
        await tulip.purchase({
            from: buyer,
            value: web3.utils.toWei('1', 'ether')
        })

        await truffleAssert.reverts(tulip.purchase({
            from: buyer,
            value: web3.utils.toWei('1', 'ether')
        }), "Project is finished minting.")
    })

    it("requires the correct amount of money", async () => {
        let tulip = await NFTulips.new()

        let contract_owner = accounts[0]
        let buyer = accounts[8]

        let starting_balance = await web3.eth.getBalance(contract_owner)
        starting_balance = parseFloat(web3.utils.fromWei(starting_balance, 'ether'))

        console.log("STARTING: ", starting_balance)


        await truffleAssert.reverts(tulip.purchase({
            from: buyer,
            value: web3.utils.toWei('0.9', 'ether')
        }), "Not enough ETH sent.")
    })

    it("allows the contract owner to change the base URI", async () => {
        let tulip = await NFTulips.new()

        let buyer = accounts[8]

        await tulip.purchase({
            from: buyer,
            value: web3.utils.toWei('1', 'ether')
        })

        owner = await tulip.ownerOf(1)
        assert.equal(owner, buyer)

        token_uri = await tulip.tokenURI(1)
        assert.equal(token_uri, 'https://api.unsplash.com/photos/1')

        await tulip.setBaseURI('https://other-url.com/nfts/')

        token_uri = await tulip.tokenURI(1)
        assert.equal(token_uri, 'https://other-url.com/nfts/1')
    })

    it("does not allow anyone but the contract owner to change the base URI", async () => {
        let tulip = await NFTulips.new()

        truffleAssert.reverts(tulip.setBaseURI('https://attacker-url.com/', {
            from: accounts[5] //not the owner
        }), "Ownable: caller is not the owner")
    })

    it("updates state", async () => {
        let tulip = await NFTulips.new()

        let buyer = accounts[8]

        await tulip.purchase({
            from: buyer,
            value: web3.utils.toWei('1', 'ether')
        })

        let likes = await tulip.getLikes()
        let price = await tulip.getPrice()
        
        await tulip.updateState(1)

        let l = await tulip.getLikes()

        assert.equal(l, 1)

        await tulip.updateState(2)
        let p = await tulip.getPrice()
        assert.equal(p, 2)
    })
})