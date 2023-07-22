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

        const sentWithdrawal = await myContract.sendInternalMessage(senderWallet.getSender(),toNano("2"));
        printTransactionFees(sentWithdrawal.transactions);
        
        expect(sentWithdrawal.transactions).toHaveTransaction({
            exitCode: 2001,
        });

    });
});
    