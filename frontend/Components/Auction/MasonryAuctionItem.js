import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
} from "react-native";
import { useMoralis } from "react-moralis";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import * as NFTAuction from "../../../assets/json/NFTAuction.json";
import { Config } from "../../Config";
import { AUCTION_CONTRACT } from "../../Constants";

const windowWidth = Dimensions.get("screen").height;
const pixelRatio = PixelRatio.get();
const MasonryAuctionItem = ({
  item,
  reload,
  currentEthPrice,
  onBidAuction,
}) => {
  const [auction, setAuction] = useState();
  const { Moralis } = useMoralis();
  const { native, Web3API } = useMoralisWeb3Api();
  const [imageHeight, setImageHeight] = useState((windowWidth * 0.9) / 2);
  const {
    fetch: auctionFetch,
    data: auctionData,
    error: auctionError,
    isLoading: isAuctionLoading,
  } = useMoralisWeb3ApiCall(native.runContractFunction, {
    chain: Config.chainId,
    address: Config.nftAuctionAddress,
    function_name: AUCTION_CONTRACT.GET_TOKEN_AUCTION_DETAILS,
    abi: NFTAuction.abi,
    params: { _nft: item.nftContractAddress, _tokenId: item.tokenId },
  });

  useEffect(() => {
    Image.getSize(
      item.imageUrl,
      (width, height) => {
        setImageHeight((((windowWidth * 0.9) / (2 * 2)) * height) / width);
      },
      (error) => {
        console.log(error);
      }
    );
  }, [item.imageUrl]);

  useEffect(() => {
    if (auctionError) {
      // console.log("auctionError ===> ", auctionError);
    }
  }, [auctionError]);

  useEffect(() => {
    if (auctionData) {
      setAuction({
        seller: auctionData[0],
        priceEth: Moralis.Units.FromWei(auctionData[1]).toFixed(3),
        priceUsd: (
          Moralis.Units.FromWei(auctionData[1]) * currentEthPrice
        ).toFixed(3),
        duration: auctionData[2],
        maxBid: auctionData[3],
        maxBidUser: auctionData[4],
        isActive: auctionData[5],
        bidAmounts: auctionData[6],
        users: auctionData[7],
        imageUrl: auctionData[8],
        nftName: auctionData[9],
      });
    }
  }, [auctionData]);

  const handleBidAuction = () => {};

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemView}>
        <View>
          <Image
            source={{ uri: item.imageUrl }}
            style={{ ...styles.logo, height: imageHeight }}
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
          <Text style={styles.title} ellipsizeMode={"tail"} numberOfLines={1}>
            {item.nftName}
          </Text>
          <Text style={styles.priceSubtitle}>Current Bid</Text>
          <View style={styles.priceWrapper}>
            <Text style={styles.priceEth}>
              {auction && auction.priceEth ? auction.priceEth : ""} ETH
            </Text>
            <Text style={styles.priceUsd}>
              ${auction && auction.priceUsd ? auction.priceUsd : ""}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={() => {
              onBidAuction(item);
            }}
            // disabled={isUploading || isFunctionFetching}
          >
            <View style={styles.buttonOuterView}>
              <View style={styles.buttonInnerView}>
                <Text style={[styles.buttonText]}>{"Place a bid"}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, //for android
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
    borderRadius: 20,
  },
  titleWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  title: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  status: {
    display: "flex",
    flexDirection: "row",
    fontSize: 12,
    color: "#999999",
    alignItems: "center",
    justifyContent: "center",
  },
  priceWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 8,
  },
  priceSubtitle: {
    fontSize: 12,
    color: "#999999",
    marginRight: 8,
  },
  priceEth: {
    fontSize: 12,
    color: "#000000",
    marginRight: 8,
  },
  priceUsd: {
    fontSize: 12,
    backgroundColor: "#E2F9E2",
  },
  remainingTime: {
    marginTop: 8,
  },
  buttonWrapper: {
    width: "100%",
    height: 48,
    marginBottom: 12,
    marginTop: 8,
    alignSelf: "center",
  },
  buttonOuterView: {
    borderRadius: 24,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
  },
  buttonInnerView: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: "#000000",
    height: 42,
    flexDirection: "row",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default MasonryAuctionItem;
