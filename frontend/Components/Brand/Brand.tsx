import React from "react";
import { View, Image, StyleSheet } from "react-native";

type Props = {
  height?: number | string;
  width?: number | string;
  mode?: "contain" | "cover" | "stretch" | "repeat" | "center";
};

const Brand = ({ height, width, mode }: Props) => {
  return (
    <View style={{ height, width }}>
      <Image
        style={styles.logo}
        source={require("../../../assets/image/instacoin_logo.png")}
        resizeMode={mode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: "100%",
  },
});

Brand.defaultProps = {
  height: 200,
  width: 200,
  mode: "contain",
};

export default Brand;
