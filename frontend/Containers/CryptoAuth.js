import React, { useState, createRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  Provider,
  ActivityIndicator,
} from "react-native-paper";
import { useMoralis } from "react-moralis";
import { useWalletConnect } from "../WalletConnect";
import { SafeAreaView } from "react-native-safe-area-context";

// import Loader from './Components/Loader';
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const CryptoAuth = ({ navigation }) => {
  const connector = useWalletConnect();
  const {
    authenticate,
    authError,
    isAuthenticating,
    isAuthenticated,
    logout,
    Moralis,
  } = useMoralis();

  const [errortext, setErrortext] = useState("");
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const passwordInputRef = createRef();

  const handleCryptoLogin = () => {
    authenticate({ connector })
      .then(() => {
        if (authError) {
          setErrortext(authError.message);
          setVisible(true);
        } else {
          if (isAuthenticated) {
            Moralis.enableWeb3();
            navigation.replace("Home");
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    isAuthenticated && navigation.replace("Home");
  }, [isAuthenticated]);

  return (
    <Provider>
      <SafeAreaView style={styles.mainBody}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Text style={styles.title}>{"Add Wallet Address"}</Text>
          <Image
            style={{ flex: 1 }}
            source={require("../../assets/image/wallet_banner.png")}
            resizeMode={"contain"}
          />
          <View style={{ flex: 1 }}>
            <KeyboardAvoidingView enabled>
              <View>
                {authError && (
                  <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                      <Dialog.Title>Authentication error:</Dialog.Title>
                      <Dialog.Content>
                        <Paragraph>
                          {authError ? authError.message : ""}
                        </Paragraph>
                      </Dialog.Content>
                      <Dialog.Actions>
                        <Button onPress={hideDialog}>Done</Button>
                      </Dialog.Actions>
                    </Dialog>
                  </Portal>
                )}
                {isAuthenticating && (
                  <ActivityIndicator animating={true} color={"white"} />
                )}
              </View>

              <TouchableOpacity
                style={styles.buttonWrapper}
                onPress={() => handleCryptoLogin()}
              >
                <View style={styles.buttonOuterView}>
                  <View style={styles.buttonInnerView}>
                    <Text style={[styles.buttonText]}>{"Connect Wallet"}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
};
export default CryptoAuth;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    alignContent: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    marginTop: 16,
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: "#7DE24E",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#7DE24E",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  inputStyle: {
    flex: 1,
    color: "white",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#dadae8",
  },
  registerTextStyle: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: "center",
    padding: 10,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
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
    color: "#FFFFFF",
    fontSize: 16,
  },
});
