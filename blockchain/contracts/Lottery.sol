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

        players.push(payable(msg.sender));

        if (block.timestamp >= lotteryStart + 30 days) {
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

    function pickWinner() private {
        require(players.length > 0, "No players in the lottery");

        uint randomIndex = getRandomNumber() % players.length;

        // Calculate the fee (2.5% of the contract balance)
        uint feeAmount = (address(this).balance * 25) / 1000;

        // Transfer the fee to the ownerFeeAddress
        payable(ownerFeeAddress).transfer(feeAmount);

        // Transfer the winnings to the winner (entire remaining balance after fee deduction)
        players[randomIndex].transfer(address(this).balance);

        // Add the winner to the list
        winners.push(players[randomIndex]);

        // Increment lotteryId and reset players array
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
