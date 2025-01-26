import React, { useState, useEffect } from 'react';
import { Button, FlatList, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const route = useRoute();
  const [username, setUsername] = useState("");
  useEffect(() => {
    const getUsername = async () => {
      const _username = AsyncStorage.getItem('username');
      setUsername(_username);
    }
    getUsername();
  }, []);
  const [templates, setTemplates] = useState([]);
  const [errors, setErrors] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchTemplateList = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const awaitedUrl = await AsyncStorage.getItem('backendUrl');
        const response = await fetch(`${awaitedUrl}/templates/fetch`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const res = await response.json();
        if (response.ok) {
          console.log('Templates fetched: ', res);
          setTemplates(res);
        } else {
          setErrors([res['error']]);
        }
      } catch (error) {
        setErrors([error.message]);
      }
    };
    fetchTemplateList();
  }, []);

  

  return (
    <View style={styles.container}>

      <View style={styles.titleContainer}>
        <Text style={styles.headerText}>My Workout</Text>
      </View>

      <Text style={styles.msg}>Looking strong, {username}!</Text>

      <View style = {styles.workouts}>
        {Object.keys(templates).map((templateName) => (
            <TouchableOpacity
            key={templateName}
            title={templateName}
            style={styles.templateButton}
            onPress={() => navigation.navigate('TemplateDetail', { username: username, template: templateName, exercises: templates[templateName].exercises })}
            >
            <Text style={styles.templateButtonText}>{templateName}</Text>
            </TouchableOpacity>
        ))}
      </View>

      {errors.length > 0 && (
        <View style={styles.errorContainer}>
          {errors.map((error, index) => (
            <Text key={index} style={styles.errorText}>
              {error}
            </Text>
          ))}
        </View>
      )}
      <TouchableOpacity
            onPress={() => navigation.navigate('Templates')}
            >
            <Text style={styles.templateButtonText}>Create new</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171c17',
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 35,
    fontFamily: 'American TypeWriter',
    marginTop: 10,
    color: 'white',
    marginLeft:20,
  },
  msg: {
    fontSize: 20,
    marginTop: 15,
    color: 'white',
    fontFamily: 'American Typewriter',
  },
  titleContainer: {
    backgroundColor: 'black',
    paddingVertical: 10,
    marginLeft:-20,
    width:'120%',
  },
  templateButton: {
    width: '100%',
    marginBottom: 15,
    paddingVertical: 15,
    backgroundColor: 'red',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    opacity: 0.9,
  },
  templateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily:'American Typewriter',
  },
  errorContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  workouts:{
    marginTop:20,
  }
});

export default HomeScreen;
