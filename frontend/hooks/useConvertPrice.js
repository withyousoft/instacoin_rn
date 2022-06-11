import { useEffect, useState } from "react";
import { Settings } from "react-native";
import { convertUSD2ETH, convertETH2USD } from "../Apis/CoinConvertApi";

export const useConvertUSD2ETH = () => {
  const [isLoading, setIsLoading] = useState(false);

  const convertPrice = async (usdPrice) => {
    setIsLoading(true);
    const result = await convertUSD2ETH(usdPrice);
    setIsLoading(false);
    return result;
  };

  return { convertPrice, isLoading };
};

export const useConvertETH2USD = () => {
  const [isLoading, setIsLoading] = useState(false);

  const convertPrice = async (ethPrice) => {
    setIsLoading(true);
    const result = await convertETH2USD(ethPrice);
    setIsLoading(false);
    return result;
  };

  return { convertPrice, isLoading };
};
