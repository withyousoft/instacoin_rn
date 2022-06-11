import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, Button } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck, faCross, faTimes } from "@fortawesome/free-solid-svg-icons";

const RemainingTime = ({ duration, style }) => {
  const [timeText, setTimeText] = useState("00h:00m:00s");

  useEffect(() => {
    if (duration < new Date().getTime()) {
      return;
    } else {
      const intervalWork = setInterval(() => {
        const currentTime = new Date().getTime();
        if (currentTime > duration) {
          setTimeText("00h:00m:00s");
          clearInterval(intervalWork);
        } else {
          const hour = Math.floor((duration - currentTime) / 3600000);
          const min = Math.floor(((duration - currentTime) % 3600000) / 60000);
          const second = Math.floor(((duration - currentTime) % 60000) / 1000);
          setTimeText(
            `${hour.toString().padStart(2, "0")}h:${min
              .toString()
              .padStart(2, "0")}m:${second.toString().padStart(2, "0")}s`
          );
        }
      }, 1000);
    }
  }, []);
  return (
    <View style={{ ...style }}>
      <Text>{timeText}</Text>
    </View>
  );
};

export default RemainingTime;
