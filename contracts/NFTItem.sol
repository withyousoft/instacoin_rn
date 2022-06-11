pragma solidity >=0.6.0 <0.9.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts@4.5.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.5.0/utils/Counters.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract NFTItem is ERC721URIStorage {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
    
  constructor() ERC721("Instacoin NFT", "ICN") {}

  mapping (bytes32 => uint256) public uriToTokenId;

  function mintItem(string memory _tokenUri) public returns (uint256)
  {
      bytes32 uriHash = keccak256(abi.encodePacked(_tokenUri));
      _tokenIds.increment();
      uint256 id = _tokenIds.current();
      _mint(msg.sender, id);
      _setTokenURI(id, _tokenUri);
      uriToTokenId[uriHash] = id;
      return id;
  }
}
