import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import * as Contacts from "expo-contacts";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";

const request = () => {
  const router = useRouter();

  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);

  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      const validContacts = data.filter(
        (contact) => contact.phoneNumbers?.length
      );
      setContacts(validContacts);
      setFilteredContacts(validContacts);
    } else {
      alert("Permission denied");
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.bar}>
          <FontAwesome
            name="search"
            size={20}
            color="black"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.input}
            placeholder="Select User by name/number/username..."
            placeholderTextColor={"#000000"}
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
        </View>
      </View>

      {searchTerm == "" ? (
        <View style={{ padding: 20 }}>
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              item.phoneNumbers?.[0]?.number == null ? null : (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/Pages/selectdoc",
                      params: {
                        name: item.name,
                        number: item.phoneNumbers?.[0]?.number,
                        image: item.image?.uri,
                      },
                    })
                  }
                >
                  <View style={styles.contactBox}>
                    <View style={styles.contactImage}>
                      <Text style={styles.initial}>
                        {item?.name?.charAt(0)?.toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.contact}>
                        {item.phoneNumbers?.[0]?.number}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            }
          />
        </View>
      ) : (
        <View style={{ padding: 20 }}>
          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/Pages/selectdoc",
                    params: {
                      name: item.name,
                      number: item.phoneNumbers?.[0]?.number,
                      image: item.image?.uri,
                    },
                  })
                }
              >
                <View style={styles.contactBox}>
                  <View style={styles.contactImage}>
                    <Text style={styles.initial}>
                      {item?.name?.charAt(0)?.toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.contact}>
                      {item.phoneNumbers?.[0]?.number}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default request;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
  box: {
    display: "flex",
    alignItems: "center",
  },
  bar: {
    marginTop: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "rgb(233, 231, 231)",
    width: "90%",
    borderRadius: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: "100%",
  },
  contactBox: {
    backgroundColor: "rgb(233, 231, 231)",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
  },
  name: {
    fontSize: 16,
    color: "black",
  },
  contact: {
    fontSize: 14,
    color: "rgb(14, 40, 183)",
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "rgb(195, 195, 195)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
