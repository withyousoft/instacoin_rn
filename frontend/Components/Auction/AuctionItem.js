import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, Button } from "react-native";
import { useMoralis } from "react-moralis";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import * as NFTAuction from "../../../assets/json/NFTAuction.json";
import { Config } from "../../Config";
import { AUCTION_CONTRACT } from "../../Constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import RemainingTime from "./RemainingTime";

const AuctionItem = ({
  duration,
  nftContractAddress,
  price,
  seller,
  tokenId,
  imageUrl,
  nftName,
  reload,
  currentEthPrice,
  onCancel,
  onSale,
}) => {
  const [auction, setAuction] = useState();
  const { Moralis } = useMoralis();
  const { native, Web3API } = useMoralisWeb3Api();
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
    params: { _nft: nftContractAddress, _tokenId: tokenId },
  });

  const image = "";
  useEffect(() => {
    if (auctionError) {
      // console.log("auctionError ===> ", auctionError);
    }
  }, [auctionError]);

  useEffect(() => {
    if (auctionData) {
      console.log("auctionData ===> ", auctionData);

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

  const renderStatus = () => {
    if (auction && auction.maxBid > 0) {
      return (
        <View style={styles.status}>
          <FontAwesomeIcon icon={faCheck} size={16} color={"#0BB10B"} />
          <Text>Up For Bidding</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.status}>
          <FontAwesomeIcon icon={faTimes} size={16} color={"#0BB10B"} />
          <Text>Not Bid Yet</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemView}>
        <View>
          <Image
            source={{ uri: imageUrl }}
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
          <View style={styles.titleWrapper}>
            <Text style={styles.title} ellipsizeMode={"tail"} numberOfLines={1}>
              {nftName}
            </Text>
            {renderStatus()}
          </View>
          <View style={styles.priceWrapper}>
            <Text style={styles.priceSubtitle}>Current Bid</Text>
            <Text style={styles.priceEth}>
              {auction && auction.maxBid
                ? Moralis.Units.FromWei(auction.maxBid).toFixed(3)
                : "---"}{" "}
              ETH
            </Text>
            <Text style={styles.priceUsd}>
              $
              {auction && auction.maxBid
                ? (
                    Moralis.Units.FromWei(auction.maxBid) * currentEthPrice
                  ).toFixed(3)
                : "---"}
            </Text>
          </View>
          <RemainingTime duration={parseInt(duration)} />
          {/* <Text style={styles.remainingTime}>15h:29m:55s:</Text> */}
          <View style={styles.buttonWrapper}>
            <Button
              title="Cancel"
              onPress={() => {
                onCancel(tokenId, nftContractAddress);
              }}
              disabled={auction && !auction.isActive}
            />
            <Button
              title="Sale"
              disabled={auction && auction.bidAmounts.length === 0}
              onPress={() => {
                onSale(tokenId, nftContractAddress);
              }}
            />
          </View>
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
    fontSize: 16,
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 8,
  },
});

export default AuctionItem;
