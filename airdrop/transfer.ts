import {
    address,
    appendTransactionMessageInstructions,
    assertIsTransactionWithinSizeLimit,
    compileTransaction,
    createKeyPairSignerFromBytes,
    createSolanaRpc,
    createSolanaRpcSubscriptions,
    createTransactionMessage,
    getSignatureFromTransaction,
    lamports,
    pipe,
    sendAndConfirmTransactionFactory,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    signTransactionMessageWithSigners,
    type TransactionMessageBytesBase64
   } from "@solana/kit";

import { getTransferSolInstruction } from "@solana-program/system";

import wallet from "./dev-wallet.json";

const keypair = await createKeyPairSignerFromBytes(new Uint8Array(wallet));
// Define our Turbin3 wallet to send to
const turbin3Wallet = address('GEyHu2gJiQsKVZAdd33gqgpG22jFrTcKgZGBxkLCzKi1');

// Create an rpc connection
const rpc = createSolanaRpc("https://api.devnet.solana.com");
const rpcSubscriptions = createSolanaRpcSubscriptions("wss://api.devnet.solana.com");

console.log(`Sending from: ${keypair.address}`);
console.log(`Sending to: ${turbin3Wallet}`);

// First get the balance from our wallet
const { value: balance } = await rpc.getBalance(keypair.address).send();
console.log(`Current balance: ${balance} lamports (${Number(balance) / 1_000_000_000} SOL)`);

// Get the latest blockhash
const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

// Build a dummy transfer instruction with 0 amount to calculate the fee
const dummyTransferInstruction = getTransferSolInstruction({
    source: keypair,
    destination: turbin3Wallet,
    amount: lamports(0n)
});

const dummyTransactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    tx => setTransactionMessageFeePayerSigner(keypair, tx),
    tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    tx => appendTransactionMessageInstructions([dummyTransferInstruction], tx)
);

// Compile the dummy transaction message to get the message bytes
const compiledDummy = compileTransaction(dummyTransactionMessage);
const dummyMessageBase64 = Buffer.from(compiledDummy.messageBytes).toString('base64') as TransactionMessageBytesBase64;

// Calculate the transaction fee
const { value: fee } = await rpc.getFeeForMessage(dummyMessageBase64).send() || 0n;

if (fee === null) {
    throw new Error('Unable to calculate transaction fee');
}

console.log(`Transaction fee: ${fee} lamports`);

if (balance < fee) {
    throw new Error(`Insufficient balance to cover the transaction fee. Balance: ${balance}, Fee: ${fee}`);
}

// Calculate the exact amount to send (balance minus fee)
const sendAmount = balance - fee;
console.log(`Sending amount: ${sendAmount} lamports (${Number(sendAmount) / 1_000_000_000} SOL)`);

const transferInstruction = getTransferSolInstruction({
    source: keypair,
    destination: turbin3Wallet,
    amount: lamports(sendAmount)
});

const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    tx => setTransactionMessageFeePayerSigner(keypair, tx),
    tx => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    tx => appendTransactionMessageInstructions([transferInstruction], tx)
);

const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
assertIsTransactionWithinSizeLimit(signedTransaction);

const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
    rpc, 
    rpcSubscriptions 
});

try {
    await sendAndConfirmTransaction(
        signedTransaction,
        { commitment: 'confirmed' }
    );
    const signature = getSignatureFromTransaction(signedTransaction);
    console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
} catch (e) {
    console.error('Transfer failed:', e);
}