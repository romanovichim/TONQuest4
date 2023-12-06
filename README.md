# TON Speedrun 

## 🚩 Challenge 4: Lottery/Raffle

🌟 Play raffle and test - test a lot of smart contracts. 

🎰 The final deliverable will be the skill of working with the balance of a smart contract and, of course raffle contract.

💬 Meet other builders working in TON and get help in the [official dev chat](https://t.me/tondev_eng) or [TON learn tg](https://t.me/ton_learn)


# Checkpoint 0:  💈 Install  💈

Required: 
* [Git](https://git-scm.com/downloads)
* [Node](https://nodejs.org/en/download/) (Use Version 18 LTS)
* [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)

(⚠️ Don't install the linux package `yarn` make sure you install yarn with `npm i -g yarn` or even `sudo npm i -g yarn`!)

```sh
git clone https://github.com/romanovichim/TONQuest4.git
```
```sh
cd challenge-4
yarn install
```
---

# Checkpoint 1: 🎲 Raffle Smart Contract and TDD 🎲

In this quest, we will play with the Lottery/Raffle smart contract. Detailed analysis of the contract here TBD.

A smart contract can be logically divided into two parts, the first part, if the message has an empty body and carries 1 TON with it, then the draw starts - a number is generated, depending on the number, you won or lost. The second part serves to service the contract, for example, add money to the balance of a smart contract or withdraw money, for example.

When creating smart contracts, most of the time will be spent writing tests, so this quest will improve your skills in writing tests. You figure it out and run:
- test example for starting the game
- try to withdraw money not from the admin wallet
- test message with more than 1 TON
- balance adding test

---

# Checkpoint 2:  🎺 Compile and Play 🎷

To play with the smart contract, we will run a simple test that will check that the transaction has been sent to the smart contract. Due to the specifics of the utility test, we will not be able to receive the message that the smart contract will send back to us. How then to check if we won?

The GET method will come to our aid.

Checking the sending of a transaction looks like this:

        const blockchain = await Blockchain.create();
        const senderWallet = await blockchain.treasury("sender");
        const myContract = blockchain.openContract(
            await MainContract.createFromConfig(senderWallet.address, codeCell)
        );

        const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("1"));
        printTransactionFees(sentMessageResult.transactions);
        
        expect(sentMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true,
        });

Let's run

```sh
yarn test
```

Result:

![image](https://user-images.githubusercontent.com/18370291/255321037-f2946848-2055-4494-b1b4-6e0aac0856ec.png)

The transaction table at the top is generated with:

        printTransactionFees(sentMessageResult.transactions);
        
I suggest you run this game test until you win, you need to catch your luck)

---

# Checkpoint 3: 🔴  Admin error  🔴

To check the error of illegal access to the withdrawal of money from a smart contract in the test, we will create an additional address and send a message from it with the necessary `op`.

        const blockchain = await Blockchain.create();

        const senderWallet = await blockchain.treasury("sender");
        const notAdminWallet = await blockchain.treasury("notadminwallet");

        const myContract = blockchain.openContract(
            await MainContract.createFromConfig(senderWallet.address, codeCell)
        );

        const sentWithdrawal = await myContract.sendWithdrawal(notAdminWallet.getSender(),toNano("1"));
        printTransactionFees(sentWithdrawal.transactions);
        expect(sentWithdrawal.transactions).toHaveTransaction({
            exitCode: 65533,
        });
        
Inside the test, it will be checked that there was a transaction with exit code 65533 - an exception occurred.

```sh
yarn admin
```

---

# Checkpoint 4: 🔮 More than 1 TON 🔮

Let's check that if an empty message with more than 1 TON is sent, an error will result. Just like last time, check the exit code:

        const blockchain = await Blockchain.create();

        const senderWallet = await blockchain.treasury("sender");

        const myContract = blockchain.openContract(
            await MainContract.createFromConfig(senderWallet.address, codeCell)
        );

        const sentWithdrawal = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("2"));
        printTransactionFees(sentWithdrawal.transactions);
        
        expect(sentWithdrawal.transactions).toHaveTransaction({
            exitCode: 2001,
        });

Let's run

```sh
yarn twoton
```

---

# Checkpoint 5: 🏁 Add Balance 🏁

The test for checking the balance is simple - we call the Get method twice, and between them we send a message, adding a balance.

        const blockchain = await Blockchain.create();

        const senderWallet = await blockchain.treasury("sender");

        const myContract = blockchain.openContract(
            await MainContract.createFromConfig(senderWallet.address, codeCell)
        );

        const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("10"));
        printTransactionFees(sentMessageResult.transactions);
        
        const getBalance = await myContract.getBalance();


        const sentAdd = await myContract.sendAddBalance(senderWallet.getSender(),toNano("1000"));

        const getNewBalance = await myContract.getBalance();

        console.log(getBalance, ' -> ' ,getNewBalance);
        expect(getNewBalance>getBalance).toBeTruthy()

```sh
yarn addton
```

> This test cannot be considered qualitative - because according to the logic of a smart contract, the balance may change due to winnings, take it as an example.


# ⚔️ Side Quests

Quick results are great, but to play longer, enjoy the ecosystem, I suggest you the following tutorials:

- [Analyze](https://github.com/romanovichim/TonFunClessons_Eng/blob/main/lessons/bonus/random/random.md) lottery/raffle contract

# 🏆 Reward 

Congratulations on successfully completing this challenge! Before we conclude, let's take a quick look at the exciting reward awaiting you from the <a target="_blank" href="https://getgems.io/collection/EQCwmhuDhKAOYidrqSL6tmt-vWNwhI4UNCjloVrlOkfMgl2M">"TON Speedrun"</a> collection:

<img style="border-radius: 10pt; margin: 25pt auto; display: block;" width="40%" src="https://ton-devrel.s3.eu-central-1.amazonaws.com/tonspeedrun/2/image.jpg">

Ready to claim your reward? Just scan the QR code, which can be generated using the script below:
```sh
yarn reward
```