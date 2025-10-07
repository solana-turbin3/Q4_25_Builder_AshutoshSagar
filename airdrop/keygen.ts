import { createKeyPairSignerFromBytes } from "@solana/kit";

function decodeBase64UrlToBytes(input: string): Uint8Array {
    const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "===".slice((base64.length + 3) % 4);
    return new Uint8Array(Buffer.from(padded, "base64"));
}

const keypair = await crypto.subtle.generateKey(
    { name: "Ed25519" },
    true,
    ["sign", "verify"]
);

const privateKeyJwk = await crypto.subtle.exportKey('jwk', keypair.privateKey);
const privateKeyBase64Url = privateKeyJwk.d;

if (!privateKeyBase64Url) throw new Error('Failed to get private key bytes')

const privateKeyBytes = decodeBase64UrlToBytes(privateKeyBase64Url);

const publicKeyBytes = new Uint8Array(await crypto.subtle.exportKey('raw', keypair.publicKey))

const keypairBytes = new Uint8Array([...privateKeyBytes, ...publicKeyBytes]);

const signer = await createKeyPairSignerFromBytes(keypairBytes);

console.log(`You have generated a new Solana wallet: ${signer.address}`);

console.log(`To save your wallet, copy and paste the following into a JSON file: [${Array.from(keypairBytes)}]`);