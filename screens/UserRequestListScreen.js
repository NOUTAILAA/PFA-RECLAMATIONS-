import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, Button } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

const UserRequestListScreen = () => {
  const [requestsData, setRequestsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [sujet, setSujet] = useState('');
  const [description, setDescription] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.userId;

  const fetchRequests = async () => {
    if (!userId) {
      return;
    }

    try {
      console.log(`Fetching requests for userId: ${userId}`);
      const response = await fetch(`http://192.168.213.141:8061/demands?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setRequestsData(data);
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      Alert.alert('Error', 'Failed to fetch requests.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRequests();
    }, [userId])
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = requestsData.filter((item) =>
      item.sujet.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.item, item.etat === 'Demande acceptée' ? styles.acceptedItem : {}]}>
      <Text style={styles.subject}>{item.sujet}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.state}>{item.etat}</Text>
      {item.etat === 'Demande rejetée' && (
        <View style={styles.rejectionReasonContainer}>
          <Text style={styles.rejectionReasonTitle}>Rejection Reason:</Text>
          <Text style={styles.rejectionReason}>{item.rejectionReason}</Text>
        </View>
      )}
    </View>
  );

  const handleAddDemand = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID is missing');
      return;
    }

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
        setModalVisible(false);
        fetchRequests(); // Refresh the requests list
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
        style={styles.searchInput}
        placeholder="Rechercher par sujet"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No requests found.</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Ajouter une demande</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter une demande</Text>
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
            <Button title="Ajouter" onPress={handleAddDemand} />
            <Button title="Annuler" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  acceptedItem: {
    backgroundColor: '#d4edda',
  },
  subject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  date: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#999',
  },
  state: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#578090',
  },
  rejectionReasonContainer: {
    marginTop: 10,
    backgroundColor: '#ffe6e6',
    padding: 10,
    borderRadius: 5,
  },
  rejectionReasonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d9534f',
  },
  rejectionReason: {
    fontSize: 14,
    color: '#d9534f',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
});

export default UserRequestListScreen;
