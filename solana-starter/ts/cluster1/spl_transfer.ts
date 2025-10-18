import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../turbin3-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("EXm4wVXvQd6bAXVZ1PW5WRF15DnqeKu1Rq77pMc8sxqE");

// Recipient address
const to = new PublicKey("LcVn5gLwSTn4KycamF3ppZ2rgdNi1UD6Hvf7N1iQjd6");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it

        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        )
        // Get the token account of the toWallet address, and if it does not exist, create it

        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        );
        console.log(`Recipient token account: ${toTokenAccount.address.toBase58()}`);
        // Transfer the new token to the "toTokenAccount" we just created
        const transferTx = await transfer(
            connection,
            keypair,
            fromTokenAccount.address,
            toTokenAccount.address,
            keypair.publicKey,
            1_000_000n
        );
        console.log(`Your transfer txid: ${transferTx}`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();