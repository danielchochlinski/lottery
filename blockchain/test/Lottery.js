const { expect } = require("chai");
require("ethers");

describe("Lottery", function () {
  let Lottery;
  let lottery;
  let owner;
  let player1;
  let player2;
  let player3;

  beforeEach(async function () {
    Lottery = await ethers.getContractFactory("Lottery");
    [owner, player1] = await ethers.getSigners();

    lottery = await Lottery.deploy();
    await lottery.deployed();
  });

  it("should allow players to enter the lottery", async function () {
    const enterAmount = ethers.utils.parseEther("0.001");
    const initialBalance = await lottery.getBalance();

    await lottery.connect(player1).enter({ value: enterAmount });

    const players = await lottery.getPlayers();

    expect(players).to.have.lengthOf(1);
    expect(players[0]).to.equal(player1.address);
    expect(await lottery.getBalance()).to.equal(
      initialBalance.add(enterAmount)
    );
  });

  it("should require a minimum amount to enter the lottery", async function () {
    const enterAmount = ethers.utils.parseEther("0.0005");

    await expect(
      lottery.connect(player1).enter({ value: enterAmount })
    ).to.be.revertedWith("At least 0.001 eth to enter lottery");
  });

  it("should pick a winner and transfer the balance to them", async function () {
    const enterAmount = ethers.utils.parseEther("0.001");

    await lottery.connect(player1).enter({ value: enterAmount });
    await lottery.connect(player2).enter({ value: enterAmount });
    await lottery.connect(player3).enter({ value: enterAmount });

    const initialBalance = await lottery.getBalance();
    const initialPlayerCount = (await lottery.getPlayers()).length;

    await lottery.connect(owner).pickWinner();

    const winners = await lottery.getWinners();
    const finalBalance = await lottery.getBalance();
    const finalPlayerCount = (await lottery.getPlayers()).length;

    expect(winners).to.have.lengthOf(1);
    expect(finalPlayerCount).to.equal(0);
    expect(finalBalance).to.equal(0);
    expect(winners[0]).to.be.oneOf([
      player1.address,
      player2.address,
      player3.address,
    ]);
    expect(await ethers.provider.getBalance(winners[0])).to.equal(
      initialBalance.div(3)
    );
  });

  it("should increment the lottery ID after picking a winner", async function () {
    await lottery.connect(owner).pickWinner();
    const lotteryIdAfterFirstPick = await lottery.getLotteryId();

    await lottery.connect(owner).pickWinner();
    const lotteryIdAfterSecondPick = await lottery.getLotteryId();

    expect(lotteryIdAfterSecondPick).to.equal(lotteryIdAfterFirstPick.add(1));
  });
});
