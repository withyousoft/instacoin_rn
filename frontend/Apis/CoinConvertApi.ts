import axios from "axios";

const convertUsd2EthApi = "https://api.coinconvert.net/convert/usd/eth?amount=";
const convertEth2UsdApi = "https://api.coinconvert.net/convert/eth/usd?amount=";

type ConvertUSD2ETHResponse = {
  status: string;
  USD: string;
  ETH: string;
};

type ConvertETH2USDResponse = {
  status: string;
  USD: string;
  ETH: string;
};

export async function convertUSD2ETH(usd: number) {
  try {
    const { data, status } = await axios.get<ConvertUSD2ETHResponse>(
      `${convertUsd2EthApi}${usd.toString()}`
    );
    console.log("convertUSD2ETH response status is: " + status);
    console.log("convertUSD2ETH response data is: " + data);
    return data.ETH;
  } catch (error) {
    console.log("Error ===> ", error);
    throw new Error("An unexpected error occured");
  }
}

export async function convertETH2USD(eth: number) {
  try {
    const { data, status } = await axios.get<ConvertETH2USDResponse>(
      `${convertEth2UsdApi}${eth.toString()}`
    );
    console.log("convertETH2USD response status is: " + status);
    console.log("convertETH2USD response data is: " + JSON.stringify(data));
    return data.USD;
  } catch (error) {
    console.log("Error ===> ", error);
    throw new Error("An unexpected error occured");
  }
}
