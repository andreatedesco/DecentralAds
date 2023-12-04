// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract GameManager is
    Ownable,
    ERC721Holder,
    FunctionsClient,
    AutomationCompatibleInterface
{
    using FunctionsRequest for FunctionsRequest.Request;

    // =============================================================
    //                           STATE VARIABLES
    // =============================================================

    address public winner;

    uint256 public endDate = 1703084400;
    
    bool public nftsSended;
    
    IERC721 public factory =
        IERC721(0xD8bdB0e3832607451e351Fd2CE8A805e2653598d);

    // Subscription ID for Chainlink VRF.
    uint64 public subscriptionId = 1515;

    // Encrypted secrets for secure data transmission.
    bytes public encryptedSecretsUrls =
        hex"1e9ce0fe8dc86ffbb0e3511f190d8f7703f26b8a425447b37518e52a69f30ee69395d5d5613761ee019fa13949aea7cd6ca33c7e784895e7229642c52f556297fe4b467dc2014656d4642a7d358fc50735cd038d22aa01b56b3cd1ab3f40c1e472a19ba51d9727caee09f1ff7000586f589205b8eb9d27788488253e5f740770d54ccb9443a8c78b6143c4fd917bbf161a";

    // The router address for Chainlink requests.
    address public router = 0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0;

    // Donation ID for Chainlink requests.
    bytes32 public donId =
        0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000;

    // Gas limit for Chainlink requests.
    uint32 public gasLimit = 300000;

    // Mapping to store errors for each request.
    mapping(bytes32 => bytes) public errors;

    // JavaScript source code for NFT creation.
    string private _source =
        "const titleId = '3EA44';"
        "const statisticName = 'enemiesKilled';"
        "const startPosition = 0;"
        "const maxResultsCount = 1;"
        "const encodedProfileConstraints = encodeURIComponent(JSON.stringify({ ShowLinkedAccounts: true }));"
        "const getLeaderboardUrl = `https://${titleId}.playfabapi.com/Server/GetLeaderboard?StatisticName=${statisticName}&StartPosition=${startPosition}&MaxResultsCount=${maxResultsCount}`;"
        "const getUserAccountInfoUrl = `https://${titleId}.playfabapi.com/Server/GetUserAccountInfo`;"
        "const leaderboardReq = await Functions.makeHttpRequest({"
        "url: getLeaderboardUrl,"
        "method: 'POST',"
        "headers: {"
        "'Content-Type': 'application/json',"
        "'Accept-Encoding': 'identity',"
        "'X-SecretKey': secrets.playfabApiKey"
        "},"
        "});"
        "if (leaderboardReq.error) throw new Error(`${leaderboardReq.message}`);"
        "const playFabId = leaderboardReq.data.data.Leaderboard[0].PlayFabId;"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: getUserAccountInfoUrl,"
        "method: 'POST',"
        "headers: {"
        "'Content-Type': 'application/json',"
        "'Accept-Encoding': 'identity',"
        "'X-SecretKey': secrets.playfabApiKey"
        "},"
        "params:{"
        "'PlayFabID': playFabId,"
        "}"
        "});"
        "if (apiResponse.error) throw new Error(`${apiResponse.message}`);"
        "return Functions.encodeString(apiResponse.data.data.UserInfo.CustomIdInfo.CustomId);";

    // =============================================================
    //                               EVENTS
    // =============================================================

    // event Response(bytes32 requestId, string ipfsUri, bytes errors);

    // =============================================================
    //                               ERRORS
    // =============================================================

    // Error for unauthorized sender.
    // error UnauthorizedSender();

    // =============================================================
    //                          CONSTRUCTOR
    // =============================================================

    /**
     * @dev Constructor that sets the router address and initializes FunctionsClient.
     */
    constructor(
    ) FunctionsClient(router) Ownable(_msgSender()) {
        // endDate = endDate_ + 5 minutes; //[TEST]
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        upkeepNeeded = block.timestamp > endDate && !nftsSended;
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        if (block.timestamp > endDate && !nftsSended) {
            _sendRequest();
        }
    }

    /**
     * @dev TODO
     */
    function _sendRequest() private {
        nftsSended = true;

        // Initializes the FunctionsRequest with the appropriate source code.
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(_source);
        req.addSecretsReference(encryptedSecretsUrls);

        // Sends the request and obtains the Chainlink VRF request ID.
        _sendRequest(req.encodeCBOR(), subscriptionId, gasLimit, donId);
    }

    // =============================================================
    //                         INTERNAL FUNCTIONS
    // =============================================================

    /**
     * @dev TODO
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        errors[requestId] = err;
        winner = _toAddress(string(response));

        factory.safeTransferFrom(address(this), winner, 0);
        factory.safeTransferFrom(address(this), winner, 1);
        factory.safeTransferFrom(address(this), winner, 2);
        factory.safeTransferFrom(address(this), winner, 3);

        // emit Response(requestId, ipfsUri, err);
    }

    function _toAddress(string memory s) private pure returns (address) {
        bytes memory _bytes = _hexStringToAddress(s);
        require(_bytes.length >= 1 + 20, "Out of bounds");
        address tempAddress;

        assembly {
            tempAddress := div(mload(add(add(_bytes, 0x20), 1)), 0x1000000000000000000000000)
        }

        return tempAddress;
    }

    function _hexStringToAddress(string memory s) private pure returns (bytes memory) {
        bytes memory ss = bytes(s);
        require(ss.length%2 == 0); // length must be even
        bytes memory r = new bytes(ss.length/2);
        for (uint i=0; i<ss.length/2; ++i) {
            r[i] = bytes1(_fromHexChar(uint8(ss[2*i])) * 16 +
                        _fromHexChar(uint8(ss[2*i+1])));
        }

        return r;
    }

    function _fromHexChar(uint8 c) private pure returns (uint8) {
        if (bytes1(c) >= bytes1('0') && bytes1(c) <= bytes1('9')) {
            return c - uint8(bytes1('0'));
        }
        if (bytes1(c) >= bytes1('a') && bytes1(c) <= bytes1('f')) {
            return 10 + c - uint8(bytes1('a'));
        }
        if (bytes1(c) >= bytes1('A') && bytes1(c) <= bytes1('F')) {
            return 10 + c - uint8(bytes1('A'));
        }
        return 0;
    }

    // =============================================================
    //                         OWNER FUNCTIONS
    // =============================================================

    /**
     * @dev TODO
     */
    function updateFactory(address factory_) external onlyOwner {
        factory = IERC721(factory_);
    }

    /**
     * @dev TODO
     */
    function updateEndDate(uint256 endDate_) external onlyOwner {
        endDate = endDate_;
    }

    /**
     * @dev Updates the subscription ID for Chainlink VRF.
     * @param subscriptionId_ The new subscription ID.
     */
    function updateSubscriptionId(uint64 subscriptionId_) external onlyOwner {
        subscriptionId = subscriptionId_;
    }

    /**
     * @dev Updates the encrypted secrets for secure data transmission.
     * @param encryptedSecretsUrls_ The new encrypted secrets.
     */
    function updateEncryptedSecretsUrls(
        bytes memory encryptedSecretsUrls_
    ) external onlyOwner {
        encryptedSecretsUrls = encryptedSecretsUrls_;
    }

    /**
     * @dev Updates the router address for Chainlink requests.
     * @param router_ The new router address.
     */
    function updateRouter(address router_) external onlyOwner {
        router = router_;
    }

    /**
     * @dev Updates the donation ID for Chainlink requests.
     * @param donId_ The new donation ID.
     */
    function updateDonId(bytes32 donId_) external onlyOwner {
        donId = donId_;
    }

    /**
     * @dev Updates the gas limit for Chainlink requests.
     * @param gasLimit_ The new gas limit.
     */
    function updateGasLimit(uint32 gasLimit_) external onlyOwner {
        gasLimit = gasLimit_;
    }

    /**
     * @dev Updates the source code for metadata creation.
     * @param source_ The new source code.
     */
    function updateSource(
        string memory source_
    ) external onlyOwner {
        _source = source_;
    }

    // =============================================================
    //                              TEST
    // =============================================================

    function sendRequest() public onlyOwner {
        _sendRequest();
    }
}