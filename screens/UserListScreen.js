import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Button, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar'; // Adjust the path as needed

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [role, setRole] = useState('');
  const [tel, setTel] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://192.168.213.141:8061/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      // Filter out the admin user
      const filteredData = data.filter(user => !(user.username === 'admin' && user.mdp === '123AZEQSD'));
      setUsers(filteredData);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`http:/192.168.213.141:8061/user/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      Alert.alert('Success', 'User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'Failed to delete user.');
    }
  };

  const handleAddUser = async () => {
    if (!username || !name || !email || !mdp || !tel) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      const response = await fetch('http://192.168.213.141:8061/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          name,
          email,
          mdp,
          role,
          tel,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to add user:', errorText);
        throw new Error(errorText);
      }

      const data = await response.json();
      Alert.alert('Success', 'User added successfully');
      setModalVisible(false);
      setUsername('');
      setName('');
      setEmail('');
      setMdp('');
      setRole('');
      setTel('');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error adding user:', error);
      Alert.alert('Error', 'Failed to add user.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}><Text style={styles.label}>Username:</Text> {item.username}</Text>
      <Text style={styles.text}><Text style={styles.label}>Name:</Text> {item.name}</Text>
      <Text style={styles.text}><Text style={styles.label}>Email:</Text> {item.email}</Text>
      <Text style={styles.text}><Text style={styles.label}>Tel:</Text> {item.tel}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('EditUserScreen', { userId: item.id })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDeleteUser(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Navbar />
      <TouchableOpacity
        style={[styles.button, styles.addButton]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Add User</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Client</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={mdp}
              onChangeText={setMdp}
              secureTextEntry={true}
            />
            <TextInput
              style={styles.input}
              placeholder="Tel"
              value={tel}
              onChangeText={setTel}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[styles.button, styles.modalButton]}
              onPress={handleAddUser}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
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
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
  addButton: {
    backgroundColor: '#007bff',
    marginBottom: 10,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  modalButton: {
    backgroundColor: '#007bff',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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

export default UserListScreen;
