import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Settings,
  Dimensions,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/AntDesign";
import InstagramLogin from "react-native-instagram-login";
import { Config } from "../Config";
import { getLongLivedToken } from "../Apis/InstagramApi";
import useConvertUSD2ETH from "../hooks/useConvertPrice";
import { convertUSD2ETH } from "../Apis/CoinConvertApi";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const LoginContainer = ({ navigation }) => {
  const instagramLoginRef = useRef();
  // const { convertPrice, ethPrice, isLoading } = useConvertUSD2ETH(44);
  // useEffect(() => {
  //   console.log("ethPrice ===> ", ethPrice);
  // }, [ethPrice]);
  // convertUSD2ETH(44).then((result) => {
  //   console.log("eth price ===> ", result);
  // });

  const setInstagramShortToken = async (data) => {
    const instagramShortToken = {
      accessToken: data.access_token,
      userId: data.user_id,
    };
    try {
      const instagramLongToken = await getLongLivedToken(
        instagramShortToken.accessToken,
        Config.instagramAppSecret
      );

      Settings.set({
        InstagramShortToken: instagramShortToken,
        InstagramLongToken: instagramLongToken,
      });

      navigation.replace("Auth");
    } catch (error) {
      console.log("Error ===> ", error);
      throw new Error("Error");
    }
  };

  return (
    <View style={styles.view}>
      <View>
        <Image
          source={require("../../assets/image/login_banner.png")}
          style={styles.bannerImage}
          resizeMode="center"
        />
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{"Earn money with your photos"}</Text>
          <Image
            source={require("../../assets/image/blue_ring.png")}
            style={styles.ringImage}
          />
        </View>

        <Text style={[styles.description]}>
          {
            "Yes, you heard it right, with Instacoin, its fairly easy to simply earn money with photos & videos"
          }
        </Text>
      </View>

      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={() => instagramLoginRef.current.show()}
      >
        <View style={styles.buttonOuterView}>
          <View style={styles.buttonInnerView}>
            <Icon name="instagram" size={25} color="white" />
            <Text style={[styles.buttonText]}>{"Login with instagram "}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <InstagramLogin
        ref={instagramLoginRef}
        appId={Config.instagramAppId}
        appSecret={Config.instagramAppSecret}
        redirectUrl={Config.instagramRedirectUri}
        incognito={false}
        scopes={["user_profile", "user_media"]}
        onLoginSuccess={setInstagramShortToken}
        onLoginFailure={(data) => {
          console.log(data);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },
  bannerImage: {
    marginTop: 32,
    marginBottom: 32,
    width: "100%",
    height: (windowWidth / 375) * 305,
    aspectRatio: 5 / 4,
  },
  titleWrapper: {
    marginBottom: 25,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    width: "80%",
    alignSelf: "center",
  },
  description: {
    marginLeft: 24,
    marginRight: 24,
    textAlign: "center",
    fontSize: 16,
  },
  ringImage: {
    width: 102,
    height: 45,
    marginTop: -45,
    marginLeft: 64,
  },
  buttonWrapper: {
    width: "80%",
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
    marginLeft: 8,
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default LoginContainer;
