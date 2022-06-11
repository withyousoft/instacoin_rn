import React from "react";
import { useMoralis } from "react-moralis";
import { useWalletConnect } from "./WalletConnect";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import SplashScreen from "./Containers/SplashScreen";
import CryptoAuth from "./Containers/CryptoAuth";
import InstagramPhotos from "./Containers/InstagramPhotos";
import CreateNftModal from "./Containers/CreateNftModal";
import BidAuctionModal from "./Containers/BidAuctionModal";
import MyAuctionsContainer from "./Containers/MyAuctionsContainer";
import AuctionsContainer from "./Containers/AuctionsContainer";
import Icon from "react-native-vector-icons/FontAwesome";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCreditCard,
  faCoins,
  faUser,
  faPaperPlane,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";

import Moralis from "moralis/types";
import LoginContainer from "./Containers/LoginContainer";

// const Activecolor =
function Home(): JSX.Element {
  return (
    <Tab.Navigator
      shifting={false}
      activeColor="#315399"
      // inactiveColor="#3e2465"
      barStyle={{ backgroundColor: "white" }}
    >
      <Tab.Screen
        name="Photos"
        options={{
          tabBarLabel: "Photos",
          tabBarIcon: ({ color, focused }) => {
            return <Icon name="instagram" color={color} size={20} />;
          },
        }}
        component={InstagramPhotos}
      />
      <Tab.Screen
        name="My Auctions"
        options={{
          tabBarLabel: "My Auctions",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faPaperPlane} color={color} size={20} />
          ),
        }}
        component={MyAuctionsContainer}
      />

      <Tab.Screen
        name="Auctions"
        options={{
          tabBarLabel: "Auctions",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faUser} color={color} size={20} />
          ),
        }}
        component={AuctionsContainer}
      />
    </Tab.Navigator>
  );
}

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Photos";

  switch (routeName) {
    case "Photos":
      return "Instagram Photos";
    case "My Auctions":
      return "My Auctions";
    case "Auctions":
      return "Ongoing Auctions";
  }
}

function App(): JSX.Element {
  const connector = useWalletConnect();
  const {
    authenticate,
    authError,
    isAuthenticating,
    isAuthenticated,
    logout,
    Moralis,
  } = useMoralis();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* SplashScreen which will come once for 5 Seconds */}
        <Stack.Group>
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            // Hiding header for Splash Screen
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginContainer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Auth"
            component={CryptoAuth}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={({ route }) => ({
              headerTitle: getHeaderTitle(route),
            })}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: "card" }}>
          <Stack.Screen
            name="CreateNftModal"
            component={CreateNftModal}
            options={{ title: "Add Details" }}
          />
          <Stack.Screen
            name="BidAuctionModal"
            component={BidAuctionModal}
            options={{ title: "Bid Now" }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
