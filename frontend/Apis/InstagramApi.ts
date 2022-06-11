import { InstagramLongToken } from "../Types";
import axios from "axios";

// const instagramDisplayApi = 'https://api.instagram.com/'
const instagramGraphApi = "https://graph.instagram.com/";
const fields = "id,media_type,media_url,username,timestamp,caption";

type GetLongLivedTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export async function getLongLivedToken(
  accessToken: string,
  appSecret: string
) {
  try {
    const { data, status } = await axios.get<GetLongLivedTokenResponse>(
      `${instagramGraphApi}access_token`,
      {
        headers: { Accept: "application/json" },
        params: {
          grant_type: "ig_exchange_token",
          client_secret: appSecret,
          access_token: accessToken,
        },
      }
    );
    console.log("getLongLivedToken response status is: " + status);
    console.log("getLongLivedToken response data is: " + status);
    return {
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
      createdAt: Math.floor(new Date().getTime() / 1000),
    } as InstagramLongToken;
  } catch (error) {
    console.log("Error ===> ", error);
    throw new Error("An unexpected error occured");
  }
}

type GetMediaFeedResponse = {
  data: {
    id: string;
    media_type: string;
    media_url: string;
    caption: string;
  }[];
  paging: { cursors: { before: string; after: string }; next: string };
};

export async function getMedia(longLivedToken: string) {
  try {
    const { data, status } = await axios.get<GetMediaFeedResponse>(
      `${instagramGraphApi}me/media`,
      {
        headers: { Accept: "application/json" },
        params: { fields: fields, access_token: longLivedToken },
      }
    );

    console.log("getMedia response status is: " + status);
    console.log("getMedia response data is: " + data);
    return data.data
      .filter((el) => el.media_type === "IMAGE")
      .map((el) => ({
        id: el.id,
        mediaType: el.media_type,
        mediaUrl: el.media_url,
        caption: el.caption,
      }));
  } catch (error) {
    throw new Error("An unexpected error occured");
  }
}
