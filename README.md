![Alt text](https://raw.githubusercontent.com/andreatedesco/DecentralAds/main/presentation/Presentation_01.png)

## Inspiration
The total number of video gamers in the world has surpassed 3 billion. This continual increase mirrors the expanding influence of the video game industry, emphasizing its profound impact on contemporary culture and entertainment. Concurrently, the in-game advertising sector has surpassed $30 billion in overall revenue, emphasizing the pivotal role of ads within the video game landscape, serving not just as a revenue source but as a fundamental element in the broader video game economy.

![Alt text](https://raw.githubusercontent.com/andreatedesco/DecentralAds/main/presentation/Presentation_02.png)

[DecentralAds](https://andreatedesco.github.io/DecentralAds) was created to enable the integration of dynamic and decentralized advertising elements within the game, allowing them to be sold, traded and customized, introducing not only a monetization opportunity, but also a new level of user engagement and interaction.

## What it does
DecentralAds serves as a bridge between software houses, sponsors, and gamers, facilitating the connection between the various players in the video game industry.

![Alt text](https://raw.githubusercontent.com/andreatedesco/DecentralAds/main/presentation/Presentation_03.png)

It enables the integration of customizable dNFTs, called DAd, within video games. These can be given to advertisers and software houses or offered to fans through lotteries. The distinguishing feature is the ability for owners to freely edit the metadata associated with their DAds, trade or resell them, offering a unique feature in the context of in-game advertising.

Given only a month's time, my personal goal for this hackathon was to get to the point of building an MVP that would allow one to:
- Create game contracts containing the DAds
- List the DAds to be inserted into the video game
- Insert DAds into the Unity video game
- Purchase DAds for sale
- Participate in lotteries
- Redeem reserved or won DAds
- Modify the metadata of DAds
- Withdraw earnings

## How I built it
I developed Smart Contracts through Solidity and implemented them on the Avalanche Fuji Tesnet. As a development environment for testing and deployment, I used Hardhat.

Distribution of metadata over IPFS has been made possible by [Chainlink Functions](https://github.com/andreatedesco/DecentralAds/blob/main/blockchain/contracts/IPFSManager.sol).
Currently, the metadata of NFTs in commerce are either saved directly on-chain, or on centralized servers, or a double manual step of storing off-chain on ipfs the metadata first, and linking the CID to the on-chain token later. 
Otherwise, DAd metadata is signed on-chain and stored on IPFS off-chain through Chainlink Functions. This provides a twofold advantage, ensuring on-chain certification of the metadata and optimizing gas consumption through off-chain storage on IPFS. Basically, a transaction containing DAd metadata is signed and sent to the DON, which takes care of storing the data on IPFS and returning the IPFS Url containing the CID of the newly created file, which will be associated with the corresponding DAd.

To report the value of AVAX in USD on-chain for DAd and ticket payments, I employed [Chainlink Data Feed](https://github.com/andreatedesco/DecentralAds/blob/main/blockchain/contracts/PriceFeedManager.sol).
This allows one to conveniently set a dollar price for purchase, but use the native currency for payment.

![Alt text](https://raw.githubusercontent.com/andreatedesco/DecentralAds/main/presentation/Presentation_07.png)

For winner selection in lotteries, I used [Chainlink VRF](https://github.com/andreatedesco/DecentralAds/blob/main/blockchain/contracts/LotteryManager.sol).

![Alt text](https://raw.githubusercontent.com/andreatedesco/DecentralAds/main/presentation/Presentation_09.png)

Finally, I utilized [Chainlink Automation](https://github.com/andreatedesco/DecentralAds/blob/main/blockchain/contracts/demo-game/GameManager.sol) to trigger, at the start of the closing ceremony (Dec. 20, 2023), the sending of the 2 DAd of the presentation game, to the first place winner, selected through the Playfab rankings using Chainlink Functions.

![Alt text](https://raw.githubusercontent.com/andreatedesco/DecentralAds/main/presentation/Presentation_13.png)

As for the front-end, I made the interface in Unity using c#. The web3 integrations were implemented using Nethereum.

## Challenges I ran into
In general, being alone and having only 30 days available, among studying Chainlink functionalities, developing smart contracts, front-end, Unity package, demo game, documentation, and presentation, the project appeared challenging from the start.

Among the most challenging processes, it's worth mentioning the metadata storage on IPFS. After exploring several strategies for key management related to the Chainlink Functions request, I opted for an off-chain approach. I chose to store the signed keys in my personal server and set the encrypted URL in the Chainlink Functions request. This decision was made in consideration of the fact that on-chain key storage rightly includes a retention time limit. However, for the specific context of this hackathon project, this limitation was not necessary.

## Accomplishments that I'm proud of
I am particularly proud to have successfully completed an MVP that tangibly demonstrates the immense potential resulting from applying tokenization principles to in-game advertising elements.

Achieving this prototype is a significant milestone for me and a recognition of my capabilities. Transforming what was merely an idea 30 days ago into a concrete and functional solution within the gaming industry fills me with pride.

## What I learned
Embarking on this hackathon, I initially lacked familiarity with Chainlink products. However, this knowledge gap became a valuable opportunity for acquiring expertise and exploring the diverse functionalities of Chainlink's offerings. Now, with satisfaction, I can affirm that I have gained considerable expertise in using Functions, VRF, Data Feeds, and Automation services and in composing the various functionalities together.

Only now, after direct experience, can I state with high certainty that the features provided by Chainlink are and will be increasingly crucial for the realization of innovative projects in the web3 space.

## What's next for DecentralAds
The project presented in this hackathon is actually just the beginning.

The goal is to transform DecentralAds into a startup ready to bring innovation to the gaming market.

Future developments will include:
- Implementation of a customizable environment for each DAd
- Support for different formats for DAds, not just banners
- Deployment of an integration package for all game engines
- On-chain reporting of DAd retention in the game
- Integration of a CPM system, where multiple images can be linked to a DAd, and the one to be displayed will be selected based on the player and their preferences expressed through digital identity

## Final Challenge
To end on a high note, I decided to challenge all viewers.
At the beginning of the closing ceremony, the first place winner of the demo game, which you can find [here](https://andreatedesco.github.io/GunmanRush), will receive the two DAds used in the presentation as a prize.

Clearly this is all done for fun!

## Deployed Smart Contracts
| Contract | Address
| ----------- | ----------- |
| AdsManager | [0x809Ac5D87560ef10dda69A9317688A4A61e8C56e](https://testnet.snowtrace.io/address/0x809Ac5D87560ef10dda69A9317688A4A61e8C56e) |
| IPFSManager | [0xa2E386d7a0008CE873101d461699890F31bE6D88](https://testnet.snowtrace.io/address/0xa2E386d7a0008CE873101d461699890F31bE6D88) |
| LotteryManager | [0xB1D899966c6A5BB4c318A0D7750CE96eD83C0128](https://testnet.snowtrace.io/address/0xB1D899966c6A5BB4c318A0D7750CE96eD83C0128) |
| PriceFeedManager | [0xbC61427f46F928C2e94A39B5c024381d0A36314c](https://testnet.snowtrace.io/address/0xbC61427f46F928C2e94A39B5c024381d0A36314c) |
| AdsFactory | [0xDdaa6748e6a300F1BDfBB170497EA67FF956e6B7](https://testnet.snowtrace.io/address/0xDdaa6748e6a300F1BDfBB170497EA67FF956e6B7) |
| GameManager | [0x3f23Ea52f1bf45E6766eD60C4317a036485d5F50](https://testnet.snowtrace.io/address/0x3f23Ea52f1bf45E6766eD60C4317a036485d5F50) |