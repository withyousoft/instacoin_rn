import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  useMoralis,
  useMoralisQuery,
  useWeb3ExecuteFunction,
} from "react-moralis";
import Animation from "../splashLottie1.json";
import LottieView from "lottie-react-native";
import AuctionItem from "../Components/Auction/AuctionItem";
import SVProgressHUD from "react-native-svprogresshud";
import { Config } from "../Config";
import { AUCTION_CONTRACT } from "../Constants";
import * as NFTAuction from "../../assets/json/NFTAuction.json";
import { useConvertETH2USD } from "../hooks/useConvertPrice";

const MyAuctionsContainer = () => {
  const { user } = useMoralis();
  const [auctions, setAunctions] = useState([]);
  const [currentEthPrice, setCurrentEthPrice] = useState(0);
  const { convertPrice } = useConvertETH2USD();
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(JSON.stringify(user))
  );
  const [count, setCount] = useState(1);
  const { fetch, isFetching, data, error, isLoading } = useMoralisQuery(
    "Auctions",
    (query) => query.equalTo("seller", currentUser.ethAddress)
    // .aggregate([{ sort: { createdAt: 1 } }])
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

  const handleCancelAuction = async (tokenId, nftContractAddress) => {
    const options = {
      chain: Config.chainId,
      contractAddress: Config.nftAuctionAddress,
      functionName: AUCTION_CONTRACT.CANCEL_AUCTION,
      abi: NFTAuction.abi,
      params: {
        _nft: nftContractAddress,
        _tokenId: tokenId,
      },
    };
    await functionFetch({ params: options });
  };
  const handleExecuteSale = async (tokenId, nftContractAddress) => {
    const options = {
      chain: Config.chainId,
      contractAddress: Config.nftAuctionAddress,
      functionName: AUCTION_CONTRACT.EXECUTE_SALE,
      abi: NFTAuction.abi,
      params: {
        _nft: nftContractAddress,
        _tokenId: tokenId,
      },
    };
    await functionFetch({ params: options });
  };

  const renderItem = ({ item }) => {
    return (
      <AuctionItem
        duration={item.duration}
        nftContractAddress={item.nftContractAddress}
        price={item.price}
        seller={item.seller}
        tokenId={item.tokenId}
        imageUrl={item.imageUrl}
        nftName={item.nftName}
        currentEthPrice={currentEthPrice}
        reload={forceReload}
        onCancel={handleCancelAuction}
        onSale={handleExecuteSale}
      />
    );
  };
  return (
    <View style={{ flex: 1 }}>
      {!isLoading && auctions.length > 0 ? (
        <FlatList
          refreshing={isLoading}
          onRefresh={fetch}
          style={styles.assetsViewer}
          scrollEnabled={true}
          data={auctions}
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

export default MyAuctionsContainer;
