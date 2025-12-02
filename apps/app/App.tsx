import React from "react";
import { View, Text } from "react-native";
import { ConvexProvider, useQuery } from "convex/react";
import { convex, api } from "./lib/convexClient";

function HelloScreen() {
  const message = useQuery(api.hello.getMessage, {});

  if (message === undefined) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Carregando mensagem do Convex...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 20 }}>{message}</Text>
      <Text style={{ fontSize: 20 }}>Test text</Text>
    </View>
  );
}

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <HelloScreen />
    </ConvexProvider>
  );
}
