import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const Navbar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = (routeName) => route.name === routeName;

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={[styles.navItem, isActive('RequestListScreen') && styles.activeNavItem]}
        onPress={() => navigation.navigate('RequestListScreen')}
      >
        <Text style={[styles.navText, isActive('RequestListScreen') && styles.activeNavText]}>Demandes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, isActive('UserListScreen') && styles.activeNavItem]}
        onPress={() => navigation.navigate('UserListScreen')}
      >
        <Text style={[styles.navText, isActive('UserListScreen') && styles.activeNavText]}>Users</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 10,
    justifyContent: 'space-around',
  },
  navItem: {
    padding: 10,
  },
  navText: {
    color: '#fff',
  },
  activeNavItem: {
    backgroundColor: '#555',
  },
  activeNavText: {
    color: '#590',
  },
});

export default Navbar;
