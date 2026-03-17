import { Stack } from "expo-router";
import React from "react";

const NewReportLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "New Report", headerShown: false }}
      />
      <Stack.Screen
        name="result"
        options={{ title: "Result", headerShown: false }}
      />
    </Stack>
  );
};

export default NewReportLayout;
