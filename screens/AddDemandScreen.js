import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const AddDemandScreen = ({ navigation, route }) => {
  const [sujet, setSujet] = useState('');
  const [description, setDescription] = useState('');
  const userId = route.params.userId;

  const handleAddDemand = async () => {
    try {
      const response = await fetch(`http://192.168.213.141:8061/demands/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sujet,
          description,
          userId,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Demand added successfully');
        navigation.navigate('UserRequestListScreen', { refresh: true });
      } else {
        console.error('Failed to add demand');
        Alert.alert('Error', 'Failed to add demand');
      }
    } catch (error) {
      console.error('Error adding demand:', error);
      Alert.alert('Error', 'Error adding demand');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Sujet"
        value={sujet}
        onChangeText={setSujet}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Ajouter une demande" onPress={handleAddDemand} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
});

export default AddDemandScreen;
