import { publicKey } from '@metaplex-foundation/umi';

export const MERKLE_MAX_DEPTH = 5;
export const MERKLE_MAX_BUFFER_SIZE = 8;

export const METADATA_COLLECTION_URL = "https://gist.githubusercontent.com/Ayushjhax/b384d59c4ccccfe44bf4442c56031aa2/raw/collection_metadata.json";
export const METADATA_ITEM_URL = "https://gist.githubusercontent.com/Ayushjhax/f172934efcab496a0c87348c157815bc/raw/item_metadata.json";
export const IMAGE_URL = "https://pbs.twimg.com/profile_images/1781648471985958912/ToJMx2-P_400x400.jpg";

export const COLLECTION_NAME = 'Solana Summer Fellowship 2024';
export const COLLECTION_SYMBOL = 'SSF24';
export const COLLECTION_DESCRIPTION = 'Solana Summer Fellowship 2024 cNFT collection from Ayush';
export const FEE_PERCENT = 0;
export const EXTERNAL_URL = 'https://x.com/ayushjhax';
export const CREATORS = [
  {
    address: publicKey('JCsFjtj6tem9Dv83Ks4HxsL7p8GhdLtokveqW7uWjGyi'),
    verified: false,
    share: 100,
  },
];

export const NFT_ITEM_NAME = 'Ayush Limited Edition';
export const NFT_ITEM_IMAGE_URL = IMAGE_URL;