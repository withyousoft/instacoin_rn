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

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export default function CreateNftModal({ route, navigation }) {
  const { Moralis } = useMoralis();
  const { id, caption, mediaType, mediaUrl } = route.params;
  const [price, onChangePrice] = React.useState(null);
  const [nftCreated, setNftCreated] = React.useState(false);
  const [description, onChangeDescription] = React.useState(caption);
  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
  const { convertPrice: convertUSD2ETH } = useConvertUSD2ETH();

  const {
    data: functionData,
    error: functionError,
    fetch: functionFetch,
    isFetching: isFunctionFetching,
    isLoading: isFunctionLoading,
  } = useWeb3ExecuteFunction();

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

  const handleCreateNft = async () => {
    const uploadImageRequest = new Request(mediaUrl);
    const imageResponse = await fetch(uploadImageRequest);
    if (!imageResponse.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const imageBlob = await imageResponse.blob();

    const imageMoralisFile = await saveFile(
      imageBlob["_data"]["name"],
      imageBlob,
      {
        saveIPFS: true,
        type: imageBlob["_data"]["type"],
        metadata: { createdById: id },
      }
    );

    const metaData = {
      name: caption,
      description: description,
      image: imageMoralisFile._ipfs,
      attributes: {
        instagramId: id,
        instagramCaption: caption,
        instagramType: mediaType,
        instagramUrl: mediaUrl,
        price: price,
      },
    };

    try {
      const metaMoralisFile = await saveFile(
        `metadata_${id}.json`,
        new Blob([JSON.stringify(metaData)], { type: "application/json" }),
        { saveIPFS: true }
      );
      console.log("metaMoralisFile ===> ", metaMoralisFile);
      const priceEth = await convertUSD2ETH(price);

      if (metaMoralisFile && metaMoralisFile._ipfs) {
        const ABI = NFTAuction.abi;
        const options = {
          chain: Config.chainId,
          contractAddress: Config.nftAuctionAddress,
          functionName: "createDefaultTokenAuction",
          abi: ABI,
          params: {
            _nftAddress: Config.nftItemAddress,
            _tokenUri: metaMoralisFile._ipfs,
            _price: Moralis.Units.ETH(priceEth),
            _duration: new Date().getTime() + DEFAULT_AUCTION_DURATION * 1000,
            _imageUrl: imageMoralisFile._ipfs,
            _nftName: description,
          },
        };
        await functionFetch({ params: options });

        Alert.alert("Conguration", "NFT is created successfully", [
          { text: "OK", onPress: () => navigation.goBack(null) },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      enabled
      keyboardVerticalOffset={100}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.outerScroll}>
        <View style={styles.inner}>
          <Image source={{ uri: mediaUrl }} style={styles.thumbImage} />
          <View style={styles.priceWrapper}>
            <Icon name="dollar" size={20} style={styles.leftIcon} />
            <TextInput
              style={styles.priceInput}
              keyboardType="numeric"
              placeholder="Set Price"
              value={price}
              onChangeText={onChangePrice}
            />
          </View>

          <TextInput
            multiline
            numberOfLines={5}
            style={styles.detailInput}
            placeholder="Add Ownership Details"
            value={description}
            onChangeText={onChangeDescription}
          />

          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={handleCreateNft}
            disabled={isUploading || isFunctionFetching}
          >
            <View style={styles.buttonOuterView}>
              <View style={styles.buttonInnerView}>
                <Text style={[styles.buttonText]}>{"Create NFT"}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  outerScroll: { flex: 1, backgroundColor: "white" },
  inner: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "space-around",
  },
  thumbImage: {
    width: windowWidth - 40,
    height: windowWidth - 40,
    borderRadius: 20,
    marginBottom: 20,
  },
  priceWrapper: {
    position: "relative",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  leftIcon: {
    position: "absolute",
    padding: 10,
    zIndex: 1,
    left: 10,
    top: 7,
  },
  priceInput: {
    flex: 1,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#EEF5F9",
    marginBottom: 20,
    paddingLeft: 40,
    paddingRight: 15,
  },
  detailInput: {
    width: "100%",
    height: 120,
    borderRadius: 27.5,
    backgroundColor: "#EEF5F9",
    marginBottom: 20,
    paddingTop: 15,
    padding: 15,
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
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  modalInner: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    width: "90%",
  },
  createdNftModal: {
    width: 300,
    height: 300,
    backgroundColor: "#999",
  },
});
