import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [mdp, setMdp] = useState('');
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogin = async () => {
    if (!username || !mdp) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('http://192.168.213.141:8061/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          mdp,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        const userId = userData.id;
        console.log('Login successful, userId:', userId);

        // Navigation based on user role or any other logic
        if (username === 'admin' && mdp === '123AZEQSD') {
          navigation.navigate('RequestListScreen');
        } else {
          navigation.navigate('UserRequestListScreen', { userId });
        }
      } else {
        const errorMessage = await response.text();
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'An error occurred while logging in. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.header, opacity: fadeAnim }}>
        <Text style={styles.title}>Let's Sign you in.</Text>
        <Text style={styles.subtitle}>Welcome back</Text>
        <Text style={styles.subtitle}>You've been missed!</Text>
      </Animated.View>
      <Animated.View style={{ ...styles.content, opacity: fadeAnim }}>
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={mdp}
          secureTextEntry
          onChangeText={setMdp}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
