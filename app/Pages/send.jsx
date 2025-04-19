import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import * as Contacts from 'expo-contacts';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const send = () => {

  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);

  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      const validContacts = data.filter(contact => contact.phoneNumbers?.length);
      setContacts(validContacts);
      setFilteredContacts(validContacts);
    } else {
      alert('Permission denied');
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);


  return (

    <View style={styles.container}>

      <View style={styles.box}>
        <View style={styles.bar}>
          <FontAwesome name="search" size={20} color="black" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Select contact by name..."
            placeholderTextColor={'#000000'}
            value={searchTerm}
            onChangeText={text => setSearchTerm(text)}
          />
        </View>
      </View>

      {searchTerm == "" ?
        <View style={{ padding: 20 }}>
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (

              item.phoneNumbers?.[0]?.number == null ? null :
                <TouchableOpacity>
                  <View style={styles.contactBox}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.contact}>{item.phoneNumbers?.[0]?.number}</Text>
                  </View>
                </TouchableOpacity>
            )}
          />
        </View>
        :
        <View style={{ padding: 20 }}>
          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <View style={styles.contactBox}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.contact}>{item.phoneNumbers?.[0]?.number}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

      }


    </View>
  )
}

export default send

const styles = StyleSheet.create({

  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  box: {
    display: 'flex',
    alignItems: 'center',
  },
  bar: {
    marginTop: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: 'rgb(233, 231, 231)',
    width: '90%',
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '100%',
  },
  contactBox: {
    backgroundColor: 'rgb(233, 231, 231)',
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    color: 'black',
  },
  contact: {
    fontSize: 14,
    color: 'rgb(14, 40, 183)',
  }
})