import { Cell, Address, toNano, Transaction } from "ton-core";
import { hex } from "../build/main.compiled.json";
import { Blockchain, prettyLogTransactions, printTransactionFees } from "@ton-community/sandbox";
import { MainContract } from "../wrappers/MainContract";
import { send } from "process";
import "@ton-community/test-utils";
import { flattenTransaction } from "@ton-community/test-utils";




describe("test tests", () => {
    it("test of test", async() => {
        const codeCell = Cell.fromBoc(Buffer.from(hex,"hex"))[0];

        const blockchain = await Blockchain.create();

        const senderWallet = await blockchain.treasury("sender");

        

        const myContract = blockchain.openContract(
            await MainContract.createFromConfig(senderWallet.address, codeCell)
        );

        const sentMessageResult = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("1"));
        printTransactionFees(sentMessageResult.transactions);
        
        /*
        expect(sentMessageResult.transactions).toHaveTransaction({
            from: senderWallet.address,
            to: myContract.address,
            success: true,
        });
        */

        //const txesArr = sentMessageResult.transactions.map(tx => flattenTransaction(tx));
        //console.log(txesArr);
       
        const getData = await myContract.getData();
        let forConsole = "Last number inside:  \n"
        forConsole = forConsole +getData + " \n"
        forConsole = forConsole + "So the result is: " + " \n"
        if(getData<10){
            forConsole = forConsole + "Congrats! You have won jackpot"
        }
        else if (getData<1000){
            forConsole = forConsole + "Congrats! You have won x2!"
        }
        else if (getData<2000){
            forConsole = forConsole + "Congrats! You have won x5!"
        }
        else {
            forConsole = forConsole + "Lost(:"
        }

        console.log(forConsole);
        expect(typeof getData).toBe("number");
 
    });
});
    