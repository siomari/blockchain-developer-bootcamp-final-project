# Design pattern decisions

The design patterns that have been used for this work are inheritance and interfaces. The NFTulips imports the openzeppelin contracts and uses the ERC721URIStorage contract. It also imports the Ownable contract that gives control to the access of the function of the contract. 

Oracles should have also been used in a decentralized way via chainlink foe example, but due to some technical problems with the API, it wasn't possible to decentralize that part. As a result the API call is in the front-end part of the project.