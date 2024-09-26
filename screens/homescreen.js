import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ImageBackground, Animated, TextInput } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
          Easy and quick
        </Animated.Text>
        <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
          Add your complaint below
        </Animated.Text>
      </View>
      <View style={styles.content}>
        <ImageBackground
          source={{ uri: 'https://www.gosselinassurances.ca/wp-content/uploads/2021/10/reclamations-gosselin-assurances.png' }}
          style={styles.imageBackground}
          imageStyle={styles.image}
        >
          <TextInput
            style={styles.input}
            placeholder="Enter your complaint"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#55295c',
  },
  header: {
    marginTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    width: '80%',
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    padding: 20,
  },
  image: {
    borderRadius: 20,
    opacity: 0.8,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffffcc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  button: {
    backgroundColor: '#ffffffcc',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#55295c',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
