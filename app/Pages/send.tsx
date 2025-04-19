import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button , StyleSheet} from 'react-native';
import * as Contacts from 'expo-contacts';

const send = () => {

  const [contacts, setContacts] = useState([]);

  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        setContacts(data);
      }
    } else {
      alert('Permission denied');
    }
  };

  useEffect(() => {
    getContacts();
  }, []);


  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Phones Contacts:</Text>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ marginVertical: 5 }}>
            {item.name} {item.phoneNumbers?.[0]?.number}
          </Text>
        )}
      />
    </View>
  )
}

export default send

const styles = StyleSheet.create({})