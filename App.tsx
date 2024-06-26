import React from "react";
import { Button, View, StyleSheet, SafeAreaView } from "react-native";

import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";

import outputs from "./amplify_outputs.json";

import {NavigationContainer} from '@react-navigation/native';

import TodoList from "./src/TodoList";
import LoginPage from "./src/LoginPage";


Amplify.configure(outputs);

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <View style={styles.signOutButton}>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Authenticator.Provider>
        <Authenticator>
          <SafeAreaView style={styles.container}>
            <SignOutButton />
            <TodoList />
          </SafeAreaView>
        </Authenticator>
      </Authenticator.Provider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  signOutButton: {
    alignSelf: "flex-end",
  },
});

export default App;

