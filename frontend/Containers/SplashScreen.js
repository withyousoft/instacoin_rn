import React, { useEffect } from "react";
import { View, StyleSheet, Settings } from "react-native";
import { Brand } from "../Components/Brand";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      const currentTimestamp = Math.floor(new Date().getTime());
      const instagramLongToken = Settings.get("InstagramLongToken");

      if (
        instagramLongToken &&
        (instagramLongToken.expiresIn + instagramLongToken.createdAt) * 1000 >
          currentTimestamp
      ) {
        navigation.replace("Auth");
      } else {
        navigation.replace("Login");
      }
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Brand />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
});

export default SplashScreen;
