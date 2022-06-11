import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  useMoralis,
  useMoralisQuery,
  useWeb3ExecuteFunction,
} from "react-moralis";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import Animation from "../splashLottie1.json";
import LottieView from "lottie-react-native";
import MasonryAuctionItem from "../Components/Auction/MasonryAuctionItem";
import SVProgressHUD from "react-native-svprogresshud";
import { Config } from "../Config";
import { AUCTION_CONTRACT } from "../Constants";
import * as NFTAuction from "../../assets/json/NFTAuction.json";
import { useConvertETH2USD } from "../hooks/useConvertPrice";
import MasonryList from "@react-native-seoul/masonry-list";

const AuctionsContainer = ({ navigation }) => {
  const { user } = useMoralis();
  const { chainId } = useMoralisDapp();
  const [auctions, setAunctions] = useState([]);
  const [currentEthPrice, setCurrentEthPrice] = useState(0);
  const { convertPrice } = useConvertETH2USD();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(JSON.stringify(user))
  );
  const [count, setCount] = useState(1);
  const {
    fetch,
    isFetching,
    data,
    error,
    isLoading,
  } = useMoralisQuery("Auctions", (query) =>
    query.notEqualTo("seller", currentUser.ethAddress)
  );

  const {
    data: functionData,
    error: functionError,
    fetch: functionFetch,
    isFetching: isFunctionFetching,
    isLoading: isFunctionLoading,
  } = useWeb3ExecuteFunction();

  useEffect(() => {
    if (user) {
      setCurrentUser(JSON.parse(JSON.stringify(user)));
    }
  }, [user]);

  useEffect(() => {
    convertPrice(1).then((usdPrice) => setCurrentEthPrice(usdPrice));
  }, []);

  const forceReload = () => {
    fetch();
  };

  useEffect(() => {
    if (data.length > 0) {
      setAunctions(data.map((el) => JSON.parse(JSON.stringify(el))));
    }
  }, [data]);

  const toggleActivityIndicator = (isLoading) => {
    if (isLoading) {
      SVProgressHUD.show();
    } else {
      SVProgressHUD.dismiss();
    }
  };

  const handleBidAuction = (item) => {
    navigation.navigate("BidAuctionModal", item);
  };

  const renderItem = ({ item }) => {
    return (
      <MasonryAuctionItem
        item={item}
        currentEthPrice={currentEthPrice}
        reload={forceReload}
        onBidAuction={handleBidAuction}
      />
    );
  };
  return (
    <View style={styles.mainView}>
      {!isLoading && auctions.length > 0 ? (
        <MasonryList
          refreshing={isLoading}
          onRefresh={fetch}
          data={auctions}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={(_item, index) => index.toString()}
        />
      ) : (
        <LottieView source={Animation} loop autoPlay />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default AuctionsContainer;
