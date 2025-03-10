import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, View, ViewStyle } from "react-native";
import {
  initialize as initializeOkHi,
  OkCollectSuccessResponse,
  OkHiException,
  OkHiLocationManager,
  OkHiLocationManagerProps,
  OkHiUser,
  UsageType,
} from "react-native-okhi";

const App = () => {
  const [launch, setLaunch] = useState(false);
  const createdLocationId = useRef<string | undefined>(undefined);

  const style: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  };
  const user: OkHiUser = {
    firstName: "John",
    lastName: "Doe",
    phone: "+234...",
    appUserId: "abcd1234",
    email: "john@okhi.co",
  };
  const theme: OkHiLocationManagerProps["theme"] = {
    appBar: {
      backgroundColor: "#333",
      logo: "https://cdn.okhi.co/icon.png",
    },
    colors: {
      primary: "#333",
    },
  };

  useEffect(() => {
    const handleInit = async () => {
      await initializeOkHi({
        credentials: {
          branchId: "", // your branch ID
          clientKey: "", // your client key
        },
        context: {
          mode: "prod",
        },
        notification: {
          title: "Address verification in progress",
          text: "Tap here to view your verification status.",
          channelId: "okhi",
          channelName: "OkHi Channel",
          channelDescription: "OkHi verification alerts",
        },
      });
    };
    handleInit();
  }, []);

  const handleOnSuccess = async (response: OkCollectSuccessResponse) => {
    try {
      createdLocationId.current = response.location.id;
      const locationId = await response.startVerification();
      console.log("started verification for: " + locationId);
    } catch (error) {
      const err = error as OkHiException;
      console.log(err.code);
      console.log(err.message);
    } finally {
      setLaunch(false);
    }
  };

  const handleError = (error: OkHiException) => {
    console.log(error.code);
    console.log(error.message);
  };

  const renderOkHiLocationManager = () => {
    const usageTypes: UsageType = createdLocationId.current ? ["digital_verification"] : ["address_book"];
    return (
      <OkHiLocationManager
        launch={launch}
        user={user}
        onCloseRequest={() => setLaunch(false)}
        onError={handleError}
        onSuccess={handleOnSuccess}
        theme={theme}
        config={{
          usageTypes,
        }}
        location={{ id: createdLocationId.current }} // pass id if created location
      />
    );
  };

  return (
    <View style={style}>
      <Button title="Create an address (address book)" onPress={() => setLaunch(true)} />
      <Button title="Verify saved address (digital)" onPress={() => setLaunch(true)} />
      {renderOkHiLocationManager()}
    </View>
  );
};

export default App;
