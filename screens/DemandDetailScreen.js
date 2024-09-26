import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const DemandDetailScreen = () => {
  const route = useRoute();
  const { demand } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détails de la demande</Text>
      <Text style={styles.label}>Sujet:</Text>
      <Text style={styles.value}>{demand.sujet}</Text>
      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{demand.description}</Text>
      <Text style={styles.label}>Date:</Text>
      <Text style={styles.value}>{demand.date}</Text>
      <Text style={styles.label}>Etat:</Text>
      <Text style={styles.value}>{demand.etat}</Text>
      {demand.etat === 'Demande rejetée' && (
        <>
          <Text style={styles.label}>Cause de rejet:</Text>
          <Text style={styles.value}>{demand.rejectionReason}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default DemandDetailScreen;
