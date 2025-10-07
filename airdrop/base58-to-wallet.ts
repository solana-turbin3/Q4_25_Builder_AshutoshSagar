import bs58 from 'bs58';
import * as promptSyncModule from 'prompt-sync';

const prompt = (promptSyncModule as any).default();

console.log("Enter your base58 private key:");
const base58 = prompt('> ');

if (!base58) {
    console.error("No input provided");
    process.exit(1);
}

try {
    const wallet = bs58.decode(base58);
    console.log("Wallet byte array:");
    console.log(`[${Array.from(wallet)}]`);
} catch (error) {
    console.error("Invalid base58 string:", error);
    process.exit(1);
}