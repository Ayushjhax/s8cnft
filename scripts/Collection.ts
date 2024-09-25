import { config } from "dotenv";
config();
import { readFileSync, writeFileSync } from "fs";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplTokenMetadata,
  createNft,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  generateSigner,
  percentAmount,
  signerIdentity,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import {
  COLLECTION_NAME,
  COLLECTION_SYMBOL,
  COLLECTION_DESCRIPTION,
  FEE_PERCENT,
  EXTERNAL_URL,
  METADATA_COLLECTION_URL,
  IMAGE_URL,
} from "./config";
import { addrToLink } from "./utils";

const rpcURL = process.env.SOLANA_MAINNET_RPC_URL || process.env.SOLANA_DEVNET_RPC_URL || "https://api.devnet.solana.com";

const payerKeyFile = "key.json";
const keyData = readFileSync(payerKeyFile, "utf8");
const secretKey = new Uint8Array(JSON.parse(keyData));

const run = async () => {
  try {
    const umi = createUmi(rpcURL).use(mplTokenMetadata());

    const keyPair = umi.eddsa.createKeypairFromSecretKey(secretKey);
    const signer = createSignerFromKeypair({ eddsa: umi.eddsa }, keyPair);
    umi.use(signerIdentity(signer));

    console.log("Signer Public Key:", signer.publicKey.toString());

    const collectionImageUri = IMAGE_URL;
    writeFileSync("./data/collectionImageUri.txt", collectionImageUri);

    const collectionObject = {
      name: COLLECTION_NAME,
      symbol: COLLECTION_SYMBOL,
      description: COLLECTION_DESCRIPTION,
      seller_fee_basis_points: FEE_PERCENT * 100,
      image: collectionImageUri,
      external_url: EXTERNAL_URL,
      properties: {
        category: "image",
        files: [{ file: collectionImageUri, type: "image/png" }],
      },
    };

    const collectionJsonUri = METADATA_COLLECTION_URL;
    console.log("Collection Metadata URI:", collectionJsonUri);
    writeFileSync("./data/collectionJsonUri.txt", collectionJsonUri);

    const collectionMint = generateSigner(umi);
    console.log("Collection Mint Public Key:", collectionMint.publicKey.toString());

    await createNft(umi, {
      mint: collectionMint,
      symbol: COLLECTION_SYMBOL,
      name: COLLECTION_NAME,
      uri: collectionJsonUri,
      sellerFeeBasisPoints: percentAmount(FEE_PERCENT),
      isCollection: true,
    }).sendAndConfirm(umi);

    const explorerCluster = process.env.NODE_ENV !== 'Mainnet' ? '?cluster=devnet' : '';
    const collectionMintExplorerUrl = `https://explorer.solana.com/address/${collectionMint.publicKey.toString()}${explorerCluster}`;
    console.log("Collection Mint Explorer URL:", collectionMintExplorerUrl);

    const txLink = addrToLink(collectionMint.publicKey.toString(), explorerCluster);
    console.log("Transaction Link:", txLink);

    const mintFileName = `./data/collectionMint${
      process.env.NODE_ENV === "Mainnet" ? "Mainnet" : "Devnet"
    }.txt`;
    writeFileSync(mintFileName, collectionMint.publicKey.toString());
    console.log(`Collection mint public key saved to: ${mintFileName}`);
  } catch (error) {
    console.error("Error creating NFT collection:", error);
  }
};

void run();
