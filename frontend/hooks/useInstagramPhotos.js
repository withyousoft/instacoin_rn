import { useEffect, useState } from "react";
import { Settings } from "react-native";
import { getMedia } from "../Apis/InstagramApi";

const useInstagramPhotos = () => {
  const instagramLongToken = Settings.get("InstagramLongToken");
  const [photos, setPhotos] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const fetchMedia = async () => {
    setIsLoading(true);
    const result = await getMedia(instagramLongToken.accessToken);
    setPhotos(result);
    setIsLoading(false);
    return result;
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  return { fetchMedia, photos, isLoading };
};

export default useInstagramPhotos;
