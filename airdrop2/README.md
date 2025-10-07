# Turbin3 Prerequisites - Rust

This is my submission for the Turbin3 Builders Cohort prerequisites (Rust). I built this to learn the basics of working with Solana using Rust.

## What I Built

I created a bunch of test functions that walk through all the essential Solana operations:

**Wallet Stuff:**
- Generate new keypairs
- Convert between Base58 and byte array formats (super handy!)
- Load wallets from JSON files

**Playing with Devnet:**
- Claim free SOL from the faucet (got myself 2 SOL to test with)
- Send 0.1 SOL to my Turbin3 wallet
- Empty out my entire dev wallet balance (learned about fee calculation here)

**The Final Boss - Enrollment:**
- Figured out how to work with PDAs (those deterministic addresses are cool)
- Called the Turbin3 prerequisite program
- Got my enrollment NFT minted on-chain!

## How to Run It

First, build everything:
```bash
cargo build
```

Make sure you have your wallet files ready:
- `dev-wallet.json` - your test wallet
- `Turbin3-wallet.json` - your actual Turbin3 wallet

Then run whichever test you want:
```bash
# Make a new wallet
cargo test keygen -- --show-output

# Get some devnet SOL
cargo test claim_airdrop -- --nocapture

# Send 0.1 SOL
cargo test transfer_sol -- --nocapture

# Send everything left
cargo test empty_wallet -- --nocapture

# Submit enrollment (the exciting one!)
cargo test enroll_turbin3 -- --nocapture
```

## What I Learned

- How Solana transactions actually work under the hood
- The difference between signing transactions in Rust vs TypeScript (it's way more explicit)
- How to calculate fees properly so you don't leave dust in accounts
- PDAs are way cooler than I thought - they're like addresses you can predict!
- Working with Metaplex Core for NFTs

## Tech Stack

- Rust (2024 edition)
- Solana SDK 3.0.0
- bs58 for encoding/decoding
- Connected to devnet: `https://api.devnet.solana.com`

## Status

All done! The enrollment transaction went through successfully. You can check it on Solana Explorer.

---

*Part of Turbin3 Builders Cohort - Rust Prerequisites Assignment*