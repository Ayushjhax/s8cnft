import dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs';
import * as bs58 from 'bs58';
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import {
  signerIdentity,
  createSignerFromKeypair,
} from '@metaplex-foundation/umi';
import {
  FEE_PERCENT,
  CREATORS,
  NFT_ITEM_NAME,
  METADATA_ITEM_URL,
} from './config';
import {
  readCsv,
  getExplorerUrl,
} from './utils';
import {
  fetchMerkleTree,
  mintToCollectionV1,
  mplBubblegum,
} from '@metaplex-foundation/mpl-bubblegum';

const rpcURL =
  (process.env.NODE_ENV === 'production'
    ? process.env.SOLANA_MAINNET_RPC_URL
    : process.env.SOLANA_DEVNET_RPC_URL) || 'https://api.devnet.solana.com';

const payerKeyFile = 'key.json';
const keyData = fs.readFileSync(payerKeyFile, 'utf8');
const secretKey = new Uint8Array(JSON.parse(keyData));

const run = async () => {
  try {
    const umi = createUmi(rpcURL)
      .use(mplTokenMetadata())
      .use(mplBubblegum());

    const keyPair = umi.eddsa.createKeypairFromSecretKey(secretKey);
    const signer = createSignerFromKeypair({ eddsa: umi.eddsa }, keyPair);
    console.log('Signer:', signer.publicKey);
    umi.use(signerIdentity(signer));

    const nodeEnv = process.env.NODE_ENV === 'production' ? 'Mainnet' : 'Devnet';
    const merkleTreeTxt = fs.readFileSync(`./data/merkleTree${nodeEnv}.txt`, 'utf8');
    const merkleTreeAccount = await fetchMerkleTree(umi, publicKey(merkleTreeTxt));
    console.log('Merkle Tree Account:', merkleTreeAccount.publicKey);

    const collectionMintTxt = fs.readFileSync(`./data/collectionMint${nodeEnv}.txt`, 'utf8');
    const collectionMintAccount = publicKey(collectionMintTxt);
    console.log('Collection Mint Account:', collectionMintAccount);

    const nftItemJsonUri = METADATA_ITEM_URL;
    console.log('NFT Item JSON URI:', nftItemJsonUri);
    fs.writeFileSync('./data/nftItemJsonUri.txt', nftItemJsonUri);

    const data = await readCsv('./addresses.csv');
    for (let i = 0; i < data.length; i++) {
      console.log(`Processing address ${i + 1} of ${data.length}`);
      const mintItemTo = publicKey(data[i].address);
      const mint = await mintToCollectionV1(umi, {
        leafOwner: mintItemTo,
        merkleTree: merkleTreeAccount.publicKey,
        collectionMint: collectionMintAccount,
        metadata: {
          name: NFT_ITEM_NAME,
          uri: nftItemJsonUri,
          sellerFeeBasisPoints: FEE_PERCENT * 100,
          collection: {
            key: collectionMintAccount,
            verified: false,
          },
          creators: CREATORS,
        },
      }).sendAndConfirm(umi);

      const nftItemMintExplorerUrl = getExplorerUrl(bs58.encode(mint.signature));
      console.log('NFT Item Mint:', nftItemMintExplorerUrl);
      fs.writeFileSync(
        `./data/nftItemMint${nodeEnv}.txt`,
        bs58.encode(mint.signature),
        { flag: 'a' } 
      );

      console.log('Pausing for 2 seconds before next mint...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('');
    }
  } catch (e) {
    console.error(e);
  }
};

void run();