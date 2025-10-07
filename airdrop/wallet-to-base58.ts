import bs58 from 'bs58';
import { readFileSync } from 'fs';

const walletPath = './turbindenet.json';

try {
    const walletData = readFileSync(walletPath, 'utf-8');
    const wallet = new Uint8Array(JSON.parse(walletData));
    console.log(wallet);
    
    const base58 = bs58.encode(wallet);
    
    console.log("Your base58 private key (for Phantom):");
    console.log(base58);
    console.log("\nYou can import this into Phantom wallet!");
} catch (error) {
    console.error("Error reading wallet file:", error);
    process.exit(1);
}