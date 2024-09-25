# Creating a Compressed Nft Collection!


*Screenshot of this cool project of me and other Fellows NFT on both mainnet and devnet.*

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/e69b2c89-dc18-48e6-a2a1-3721e63be488" alt="Image 1" width="300" />
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/8460acd0-1482-474c-81e6-a325d25256bd" alt="Image 2" width="300" />
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/5e92c243-d7ae-4f9d-becb-16c9205880ee" alt="Image 3" width="300" />
    </td>
  </tr>
</table>

# Compressed NFTs on Solana: Scalable and Cost-Efficient NFT Minting

**Compressed NFTs** (cNFTs) on Solana offer a groundbreaking approach to minting and managing NFTs at scale. By utilizing **off-chain storage** and **on-chain proofs** via **Merkle trees**, cNFTs significantly reduce the cost and increase the scalability of NFT projects. This makes them ideal for high-volume applications, such as gaming, digital collectibles, and more.

## How Compressed NFTs Work

Compressed NFTs leverage a combination of on-chain and off-chain infrastructure to provide an efficient way to handle large-scale NFT collections.

### Merkle Tree: Efficient On-Chain Proofs
A **Merkle tree** is a cryptographic data structure that enables efficient and secure verification of large datasets, including NFT collections. Compressed NFTs use a Merkle tree to store compressed proofs directly on-chain, while the majority of the data is stored off-chain. This allows for secure and compact representation of many NFTs without overwhelming the blockchain.

You can create a Merkle tree using the `createTree()` function from **Metaplex Bubblegum**, which serves as the backbone for storing and verifying the NFTs.

### NFT Collection: Organizing Your NFTs
An **NFT Collection** is a structured group of related NFTs, all sharing the same metadata and ownership characteristics. This is created using the `createNft()` function from **Metaplex**, which sets up the necessary metadata and ownership details for the collection. Organizing NFTs into collections helps manage them efficiently, especially in large-scale projects.

### Minting Compressed NFTs
Minting is the process of adding new NFTs to an existing collection. With compressed NFTs, minting is handled using the `mintToCollectionV1()` function from **Metaplex Bubblegum**. By using the Merkle tree structure, multiple NFTs can be minted in a highly compressed format, drastically reducing both the time and cost associated with traditional NFT minting.

### Key Benefits of Compressed NFTs
- **Cost Efficiency**: Compressed NFTs minimize on-chain storage, resulting in significantly lower transaction costs.
- **Scalability**: The use of Merkle trees allows for the efficient minting and management of large-scale NFT collections, making it ideal for high-volume applications.
- **Security**: While most of the data is stored off-chain, on-chain Merkle proofs ensure the security and integrity of the NFTs.
- **Versatility**: cNFTs are perfect for various use cases, including gaming assets, digital art, collectibles, and more.

