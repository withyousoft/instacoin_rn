import React, { useEffect, useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Image,
  Text,
  FlatList,
} from "react-native";
import {
  useMoralis,
  useMoralisQuery,
  useMoralisSubscription,
} from "react-moralis";
import { useNFTBalanceForContract } from "../hooks/useNFTBalanceForContract";
import { useNFTBalance } from "../hooks/useNFTBalance";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { Divider, Card } from "@ui-kitten/components";
import Animation from "../splashLottie1.json";
import LottieView from "lottie-react-native";
import NFTItem from "../Components/NFT/NFTItem";
import SVProgressHUD from "react-native-svprogresshud";

const NFTAssetsForContract = () => {
  const { getNFTBalance, NFTBalance, isLoading } = useNFTBalance();
  const { chainId } = useMoralisDapp();
  const [approvedTokesIds, setApprovedTokenIds] = useState([]);
  const [count, setCount] = useState(1);
  const {
    fetch,
    isFetching,
    data,
    error,
    isLoading: isQueryLoading,
  } = useMoralisQuery("approvedNfts");

  const forceReload = () => {
    fetch();
  };

  useEffect(() => {
    if (data.length > 0) {
      const tokenIds = data.map((el) => {
        const newEl = JSON.parse(JSON.stringify(el));
        return newEl.tokenId;
      });
      setApprovedTokenIds(Array.from(new Set(tokenIds)));
    }
  }, [data]);

  const toggleActivityIndicator = (isLoading) => {
    if (isLoading) {
      SVProgressHUD.show();
    } else {
      SVProgressHUD.dismiss();
    }
  };

  useEffect(() => {
    if (NFTBalance) {
      console.log("NFTBalance ===> ", NFTBalance);
    }
  }, [NFTBalance]);

  const renderItem = ({ item }) => {
    return (
      <NFTItem
        tokenAddress={item.token_address}
        image={item?.image}
        nftName={item?.name}
        chain={chainId}
        contractType={item.contract_type}
        tokenId={item.token_id}
        metadata={item.metadata}
        toggleProgress={toggleActivityIndicator}
        approvedTokens={approvedTokesIds}
        reload={forceReload}
      />
    );
  };
  return (
    <View style={{ flex: 1 }}>
      {!isLoading && NFTBalance.length > 0 ? (
        <FlatList
          refreshing={isLoading}
          onRefresh={getNFTBalance}
          style={styles.assetsViewer}
          scrollEnabled={true}
          data={NFTBalance}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <LottieView source={Animation} loop autoPlay />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: "black",
    fontWeight: "600",
    fontSize: 35,
    backgroundColor: "white",
    paddingTop: 10,
  },

  assetsViewer: {
    borderRadius: 10,
    backgroundColor: "white",
  },
});

export default NFTAssetsForContract;
