import { useEffect, useState } from "react";
import { Text } from "react-native";

interface Props {
  style: any;
  id: number;
  token: string;
}

export default function BloodType({ style, id, token }: Props) {
  const [blood, setBlood] = useState<string>("aaaaaaaaaaaaaaa");
  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/simca/userBlood/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((data) => data.text())
      .then((text) => setBlood(text))
      .catch(() => setBlood("error"));
  }, []);
  return <Text style={style}>{blood}</Text>;
}
