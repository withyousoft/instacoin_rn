import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import {
  StyleSheet,
  View,
  FlatList,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  Image,
  Settings,
  Dimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { getMedia } from "../Apis/InstagramApi";
import { TouchableOpacity } from "react-native-gesture-handler";
import useInstagramPhotos from "../hooks/useInstagramPhotos";

const instagramLongToken = Settings.get("InstagramLongToken");
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

export default function InstagramPhotos({ navigation }) {
  const { fetchMedia, photos, isLoading } = useInstagramPhotos();

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("CreateNftModal", item)}
      >
        <View style={styles.imageView} key={item.id}>
          <Image style={styles.imageCell} source={{ uri: item.mediaUrl }} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, styles.container]}>
      <FlatList
        data={photos}
        renderItem={renderItem}
        numColumns={2}
        refreshing={isLoading}
        onRefresh={fetchMedia}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "white",
  },
  chainText: {
    fontSize: 15,
    color: "#414a4c",
    paddingTop: 20,
    paddingHorizontal: 5,
    fontWeight: "600",
  },
  headerText: {
    color: "black",
    fontWeight: "600",
    fontSize: 35,
  },
  viewContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flex: 10,
  },
  imageView: {
    width: (windowWidth - 24) / 2,
    marginLeft: 8,
    marginTop: 8,
    height: (windowWidth - 24) / 2,
    backgroundColor: "#FF0000",
    borderRadius: 4,
  },
  imageCell: {
    width: (windowWidth - 24) / 2,
    height: (windowWidth - 24) / 2,
    borderRadius: 4,
  },
});
