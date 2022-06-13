import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  useMoralis,
  useMoralisFile,
  useWeb3ExecuteFunction,
} from "react-moralis";
import * as NFTAuction from "../../assets/json/NFTAuction.json";
import SVProgressHUD from "react-native-svprogresshud";
import { Config } from "../Config";
import { useConvertUSD2ETH } from "../hooks/useConvertPrice";
import { DEFAULT_AUCTION_DURATION } from "../Constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { AUCTION_CONTRACT } from "../Constants";
import RemainingTime from "../Components/Auction/RemainingTime";
import { useConvertETH2USD } from "../hooks/useConvertPrice";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export default function BidAuctionModal({ route, navigation }) {
  const { Moralis } = useMoralis();
  const {
    duration,
    imageUrl,
    nftContractAddress,
    nftName,
    price,
    seller,
    tokenId,
  } = route.params;
  const [nftCreated, setNftCreated] = React.useState(false);
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
  const { convertPrice: convertUSD2ETH } = useConvertUSD2ETH();
  const [auction, setAuction] = useState();
  const { native, Web3API } = useMoralisWeb3Api();
  const { convertPrice } = useConvertETH2USD();
  const [currentEthPrice, setCurrentEthPrice] = useState(0);

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

  const {
    data: functionData,
    error: functionError,
    fetch: functionFetch,
    isFetching: isFunctionFetching,
    isLoading: isFunctionLoading,
  } = useWeb3ExecuteFunction();

  useEffect(() => {
    if (auctionError) {
      // console.log("auctionError ===> ", auctionError);
    }
  }, [auctionError]);

  useEffect(() => {
    convertPrice(1).then((usdPrice) => setCurrentEthPrice(usdPrice));
  }, []);

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
  useEffect(() => {
    if (isUploading) {
      SVProgressHUD.show("Uploading to IPFS");
    } else {
      SVProgressHUD.dismiss();
    }
  }, [isUploading]);

  useEffect(() => {
    if (functionError) {
      console.log("functionError ===> ", functionError);
    }
  }, [functionError]);

  useEffect(() => {
    if (functionData) {
      console.log("functionData ===> ", functionData);
    }
  }, [functionData]);

  useEffect(() => {
    if (isFunctionLoading) {
      SVProgressHUD.show("Loading Smart Contract");
    } else {
      SVProgressHUD.dismiss();
    }
  }, [isFunctionLoading]);

  useEffect(() => {
    if (isFunctionFetching) {
      SVProgressHUD.show("Fetching data from Smart Contract");
    } else {
      SVProgressHUD.dismiss();
    }
  }, [isFunctionFetching]);

  const handleBidAuction = async () => {
    console.log("price ==> ", price);
    try {
      const ABI = NFTAuction.abi;
      const options = {
        chain: Config.chainId,
        contractAddress: Config.nftAuctionAddress,
        functionName: AUCTION_CONTRACT.BID,
        abi: ABI,
        msgValue: Math.floor(price * 1.1).toString(),
        params: {
          _nft: Config.nftItemAddress,
          _tokenId: tokenId,
        },
      };
      const result = await Moralis.executeFunction(options);

      Alert.alert("Conguration", "NFT is created successfully", [
        { text: "OK", onPress: () => navigation.goBack(null) },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

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
    <View style={styles.container}>
      <View style={styles.inner}>
        <Image source={{ uri: imageUrl }} style={styles.thumbImage} />

        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{nftName}</Text>
          {/* {renderStatus()} */}
        </View>
        <View style={styles.priceWrapper}>
          <Text style={styles.priceSubtitle}>Current Bid</Text>
          <Text style={styles.priceEth}>
            {auction && auction.priceEth ? auction.priceEth : ""} ETH
          </Text>
          <Text style={styles.priceUsd}>
            ${auction && auction.priceUsd ? auction.priceUsd : ""}
          </Text>
        </View>
        <RemainingTime
          duration={parseInt(duration)}
          style={styles.remainingTime}
        />

        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={handleBidAuction}
          disabled={isUploading || isFunctionFetching}
        >
          <View style={styles.buttonOuterView}>
            <View style={styles.buttonInnerView}>
              <Text style={[styles.buttonText]}>{"Place A Bid"}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  inner: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  thumbImage: {
    width: windowWidth - 40,
    height: windowWidth - 40,
    borderRadius: 20,
    marginBottom: 20,
  },

  buttonWrapper: {
    width: "100%",
    height: 60,
    marginBottom: 32,
    alignSelf: "center",
  },
  buttonOuterView: {
    borderRadius: 30,
    height: 60,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
  },
  buttonInnerView: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 27,
    backgroundColor: "#000000",
    height: 54,
    flexDirection: "row",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },

  titleWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontSize: 24,
  },
});
