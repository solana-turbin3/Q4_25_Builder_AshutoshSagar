import { Commitment, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import wallet from "../turbin3-wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const mint = new PublicKey("FFmoj2MBNFZzZcjHocjif51grPze3QH7BRdha3JGrTmA");

const recipients = [
    "LcVn5gLwSTn4KycamF3ppZ2rgdNi1UD6Hvf7N1iQjd6"
].map((address) => new PublicKey(address));

(async () => {
    try {
        const ownerAta = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );
        for (const to of recipients) {
            const toAta = await getOrCreateAssociatedTokenAccount(
                connection,
                keypair,
                mint,
                to
            );

            const sig = await transfer(
                connection,
                keypair,
                ownerAta.address,
                toAta.address,
                keypair.publicKey,
                1n,
                []
            );
        }
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();