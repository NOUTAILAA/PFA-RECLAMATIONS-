import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import Navbar from './Navbar';

const RequestListScreen = () => {
  const [allRequestsData, setAllRequestsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await fetch(`http://192.168.213.141:8061/demands`);
      const data = await response.json();
      console.log('Fetched data:', data);
      setAllRequestsData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filterAndPaginateData = () => {
    const filtered = allRequestsData.filter(item =>
      item.sujet.toLowerCase().includes(searchText.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);
    return { paginatedData, totalPages };
  };

  const { paginatedData, totalPages } = filterAndPaginateData();

  const updateRequestState = async (id, newState, rejectionReason = '') => {
    try {
      const url = `http://192.168.213.141:8061/demands/${id}/${newState}`;
      const body = newState === 'reject' ? JSON.stringify({ rejectionReason }) : null;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (response.ok) {
        Alert.alert('Success', `The request has been ${newState === 'accept' ? 'accepted' : 'rejected'}.`);
        fetchData(); // Refresh the data to reflect changes
      } else {
        const errorMessage = await response.text();
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Error updating request:', error);
      Alert.alert('Error', 'Error updating the request.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.subject}>{item.sujet}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.state}>{item.etat}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => updateRequestState(item.id, 'accept')}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => {
            setSelectedRequestId(item.id);
            setShowRejectionModal(true);
          }}
        >
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Navbar />

      <TextInput
        style={styles.searchInput}
        placeholder="Search by subject"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={paginatedData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={styles.pageButton}
          onPress={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
          disabled={currentPage === 1}
        >
          <Text style={styles.pageButtonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumber}>{currentPage} / {totalPages}</Text>
        <TouchableOpacity
          style={styles.pageButton}
          onPress={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showRejectionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRejectionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Rejection Reason</Text>
            <TextInput
              style={styles.input}
              placeholder="Rejection Reason"
              value={rejectionReason}
              onChangeText={setRejectionReason}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={() => {
                  updateRequestState(selectedRequestId, 'reject', rejectionReason);
                  setShowRejectionModal(false);
                  setRejectionReason('');
                }}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 16,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9', // Added background color
  },
  subject: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginVertical: 5,
  },
  date: {
    fontSize: 12,
    color: 'gray',
  },
  state: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10, // Added margin to separate buttons from text
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#45A049',
    borderWidth: 1,
  },
  rejectButton: {
    backgroundColor: '#f44336',
    borderColor: '#e53935',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
  },
  pageButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  pageButtonText: {
    color: 'white',
    fontSize: 16,
  },
  pageNumber: {
    fontSize: 16,
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
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'gray',
    marginLeft: 10,
  },
});

export default RequestListScreen;
