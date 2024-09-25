import dotenv from "dotenv";
dotenv.config();
import * as fs from "fs";
import { performance } from "perf_hooks";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  generateSigner,
  signerIdentity,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";

import { createTree, mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";

import { MERKLE_MAX_DEPTH, MERKLE_MAX_BUFFER_SIZE } from "./config";

import { addrToLink } from "./utils";

const rpcURL =
  (process.env.NODE_ENV === "production"
    ? process.env.SOLANA_MAINNET_RPC_URL
    : process.env.SOLANA_DEVNET_RPC_URL) || "https://api.devnet.solana.com";

const payerKeyFile = "key.json";
const keyData = fs.readFileSync(payerKeyFile, "utf8");
const secretKey = new Uint8Array(JSON.parse(keyData));

const run = async () => {
  const startTime = performance.now();

  try {
    const umi = createUmi(rpcURL).use(mplTokenMetadata()).use(mplBubblegum());

    const keyPair = umi.eddsa.createKeypairFromSecretKey(secretKey);
    const signer = createSignerFromKeypair({ eddsa: umi.eddsa }, keyPair);
    umi.use(signerIdentity(signer));

    console.log("Signer publicKey:", signer.publicKey.toString());

    const merkleTree = generateSigner(umi);
    console.log(
      "Generated Merkle Tree publicKey:",
      merkleTree.publicKey.toString()
    );

    const builder = await createTree(umi, {
      merkleTree,
      maxDepth: MERKLE_MAX_DEPTH,
      maxBufferSize: MERKLE_MAX_BUFFER_SIZE,
    });

    await builder.sendAndConfirm(umi);
    console.log("Merkle tree created and transaction confirmed.");

    const cluster =
      process.env.NODE_ENV !== "production" ? "?cluster=devnet" : "";
    const txLink = addrToLink(merkleTree.publicKey, cluster);
    console.log("Transaction link:", txLink);

    const network =
      process.env.NODE_ENV === "production" ? "Mainnet" : "Devnet";
    const merkleFilePath = `./data/merkleTree${network}.txt`;
    fs.writeFileSync(merkleFilePath, merkleTree.publicKey.toString());
    console.log(`Merkle tree public key saved to: ${merkleFilePath}`);
  } catch (e) {
    console.error("Error occurred:", e);
  } finally {
    const endTime = performance.now();
    console.log(
      `Execution completed in ${(endTime - startTime).toFixed(2)} ms`
    );
  }
};

void run();
