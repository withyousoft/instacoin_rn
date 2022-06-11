import React, { useEffect } from "react";
import { View, StyleSheet, Image, Text, Button } from "react-native";
import { useMoralis } from "react-moralis";
import { getNativeByChain } from "../../helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";
import * as NFTAuction from "../../../assets/json/NFTAuction.json";
import * as NFTToken from "../../../assets/json/NFTItem.json";
import { Config } from "../../Config";
import { useConvertUSD2ETH } from "../../hooks/useConvertPrice";
import {
  AUCTION_CONTRACT,
  DEFAULT_AUCTION_DURATION,
  TOKEN_CONTRACT,
} from "../../Constants";

const NFTItem = ({
  tokenAddress,
  image,
  nftName,
  chain,
  contractType,
  tokenId,
  metadata,
  toggleProgress,
  approvedTokens,
  reload,
}) => {
  const { Moralis } = useMoralis();
  const {
    data,
    error,
    fetch,
    isFetching,
    isLoading,
  } = useWeb3ExecuteFunction();
  const { convertPrice } = useConvertUSD2ETH();

  useEffect(() => {
    if (error) {
      toggleProgress(false);
    }
  }, [error]);

  const handleApproveToken = async () => {
    toggleProgress(true);
    const options = {
      chain: Config.chainId,
      contractAddress: Config.nftItemAddress,
      functionName: TOKEN_CONTRACT.APPROVE,
      abi: NFTToken.abi,
      params: {
        to: Config.nftAuctionAddress,
        tokenId,
      },
    };

    await fetch({ params: options });
    toggleProgress(false);
    reload();
  };

  const handleStartAuction = async () => {
    toggleProgress(true);

    const ethPrice = await convertPrice(metadata.attributes.price);
    const options = {
      chain: Config.chainId,
      contractAddress: Config.nftAuctionAddress,
      functionName: AUCTION_CONTRACT.CREATE_TOKEN_AUCTION,
      abi: NFTAuction.abi,
      params: {
        _nft: Config.nftItemAddress,
        _tokenId: tokenId,
        _price: Moralis.Units.ETH(ethPrice),
        _duration:
          Math.floor(new Date().getTime() / 1000) + DEFAULT_AUCTION_DURATION,
        _imageUrl: metadata.image,
        _nftName: metadata.name,
      },
    };

    fetch({ params: options });
    toggleProgress(false);
    reload();
  };
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemView}>
        <View>
          <Image
            source={{ uri: image }}
            style={styles.logo}
            defaultSource={{
              uri: `data:image/png;base64,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`,
            }}
          />
        </View>
        <View
          style={{
            justifyContent: "flex-start",
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <Text style={styles.nameBig}>{nftName}</Text>
          <Text style={styles.name}>Contract Type: {contractType}</Text>
          <Text style={styles.name} ellipsizeMode={"tail"} numberOfLines={1}>
            TokenId: {tokenId}
          </Text>
          <Text style={styles.name} ellipsizeMode={"tail"} numberOfLines={1}>
            Token Address: {tokenAddress}
          </Text>
          <Text style={styles.name} ellipsizeMode={"tail"} numberOfLines={1}>
            Chain: {getNativeByChain(chain)}
          </Text>
          {approvedTokens.some((el) => el === tokenId) ? (
            <Button title="Start Auction" onPress={handleStartAuction} />
          ) : (
            <Button title="Approve Token" onPress={handleApproveToken} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "white",
    paddingTop: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 30,
    elevation: 5, //for android
    shadowColor: "#171717",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    paddingBottom: 10,
  },
  itemView: {
    backgroundColor: "white",
    width: "90%",
    flexDirection: "column",
    shadowColor: "black",
    shadowRadius: 40,
  },
  nameBig: {
    fontSize: 25,
    color: "#414a4c",
    fontWeight: "600",
  },
  name: {
    fontSize: 15,
    color: "#414a4c",
    fontWeight: "600",
  },
  logo: {
    height: 250,
    borderRadius: 20,
  },
});

export default NFTItem;
