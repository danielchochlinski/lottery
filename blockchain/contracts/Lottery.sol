// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

contract Lottery {
    //state
    address public owner;
    address public ownerFeeAddress;
    address payable[] public players;
    address[] public winners;
    uint public lotteryId;
    uint public lotteryStart;

    constructor() {
        //owner = lottery account (money pool)
        owner = msg.sender;
        // ownerFeeAdress = creators fee account
        ownerFeeAddress = address(0x64B9a8F7CC61DD98fa9a147e6034B3C855c11CE4);
        lotteryId = 0;
        lotteryStart = block.timestamp;
    }

    //Enter function
    function enter() public payable {
        require(
            msg.value >= 0.001 ether,
            "At least 0.001 eth to enter lottery"
        );

        //used to calculate 30days
        uint thirtyDays = 30 days;
        uint timestampForThirtyDays = lotteryStart + thirtyDays;

        uint ownerFee = (msg.value * 25) / 10000; //0.025% goes to the owner
        uint entryAmount = msg.value - ownerFee;
        payable(owner).transfer(entryAmount);

        payable(ownerFeeAddress).transfer(ownerFee);

        players.push(payable(msg.sender));
        if (lotteryStart <= timestampForThirtyDays) {
            pickWinner();
        }
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getLotteryId() public view returns (uint) {
        return lotteryId;
    }

    function getRandomNumber() public view returns (uint) {
        return uint(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    function pickWinner() public {
        uint randomIndex = getRandomNumber() % players.length;
        players[randomIndex].transfer(address(this).balance);
        winners.push(players[randomIndex]);
        lotteryId++;
        lotteryStart = block.timestamp;
        delete players;
    }

    function checkTime() public view returns (uint) {
        return lotteryStart;
    }

    function getWinners() public view returns (address[] memory) {
        return winners;
    }
}
