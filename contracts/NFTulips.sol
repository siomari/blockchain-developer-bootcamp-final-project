// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
    @dev Contract that provides an NFT mining process that creates an NFT. 
    And based on the likes of the contract the initial supply of the NFT decreases.
    This contract inherites ERC721UTIStorage and Ownable contracts from Openzeppelin.
 */

contract NFTulips is ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;
    using Strings for uint256;
    // stores the current supply of the NFT
    Counters.Counter private _tokenIds;

    string private _customBaseURI;
    uint256 private _price;
    uint256 private _maxMintable;
    uint256 private _likes=0;

    event UpdateState(uint256 _price, uint256 _maxMintable, uint256 _likes);    

    /**
        @dev Initialzes the NFT by giving name and symbol and sets the maximum number of mintable nfts and the price.
     */
    constructor() ERC721("NFTulips", "TUL") {
        setBaseURI("https://api.unsplash.com/photos/");
        _maxMintable = 20;
        _price = 1;
    }

    /**
        @dev Stores the likes in the state variable _likes
        @param likes The likes of the image retrieved by the api    
     */

    function setLikes(uint256 likes) private {
        _likes = likes;
    }

    /**
        @dev A function that updates the state variables based on the difference of current likes and previous likes of the image.
        When the likes increases the number of the nfts that can be minted decreases. Moreover the price of the nft increaces by 1.
        If likes decreases no transaction can be completed.
        @param likes the number of the reactions retrieved by the api and passed through the javascript inyp the smart contract.
     */
    function updateState(uint256 likes) public{
        if(_likes!=0){
            uint256 d = likes - _likes;
            if(d>0){
                _maxMintable = _maxMintable - d;
                require(_tokenIds.current() <= _maxMintable, "Project is finished miniting.");
                _price = _price + 1;
                setLikes(likes);
            }     

        }
        setLikes(likes);
        emit UpdateState(_price, _maxMintable, _likes);
        
    }

    /**
        @dev getter function that returns the number of likes stored in the state variable _likes
        @return uint256 the state variable _likes
     */
    function getLikes() public view returns(uint256){
        return _likes;
    }

    /**
        @dev getter function that returns the number of the nfts that can be minted
        @return uint256 the state variable _maxMintable
     */
    function getMaxMintable() public view returns(uint256){
        return _maxMintable;
    }

    /**
        @dev getteer function that returns the price of the nfts
        @return uint256 the state variable _price
     */
    function getPrice() public view returns(uint256){
        return _price;
    }

    /**
        @dev a function that changes the base uri of the nft. This function can be called inly from the owner of the contract.
        @param customBaseURI_ The new base uri 
     */
    function setBaseURI(string memory customBaseURI_) public onlyOwner {
        _customBaseURI = customBaseURI_;
    }

    /**
        @dev a function that returns the baseuri, overrided by the ERC721URIStorage contract.
        @return string the base uri
     */
    function _baseURI() internal view virtual override returns (string memory){
        return _customBaseURI;
    }
    
    /**
        @dev a payable function that transfer the money from the buyer to the owner of the nft. The buyer receives the nft.
     */
    function purchase() public payable{
        require(msg.value >= _price, "Not enough ETH sent.");

        (bool sent, bytes memory data) = payable(owner()).call{value: msg.value}("");
        require(sent, 'Failed to send Ether');
        mintForPurchase(msg.sender);
    }

    /**
        @dev a function tha returns the number of the nfts that have been minted.
        @return uint256 the number of the nfts that have been minted.
     */
    function currentSupply() public view returns (uint256){
        return _tokenIds.current();
    }

    /**
        @dev the buyer can mint the nft after purchace it.
        @param recipient the nft buyer
     */
    function mintForPurchase(address recipient) private{
        _tokenIds.increment();

        require(_tokenIds.current() <= _maxMintable, "Project is finished minting.");
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
    }
}