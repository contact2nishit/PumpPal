import React, { useState, useEffect } from 'react';
import { Button, FlatList, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import { ScrollView } from 'react-native';

const HomeScreen = () => {
  const route = useRoute();
  const [username, setUsername] = useState("");
  const [templates, setTemplates] = useState([]);
  const [errors, setErrors] = useState([]);
  const [progress, setProgress] = useState(0);
  const [startValue, setStartValue] = useState(0);
  const [endValue, setEndValue] = useState(0);
  const [xp, setXp] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    // Fetch username from AsyncStorage
    const getUsername = async () => {
      const _username = await AsyncStorage.getItem('username');
      setUsername(_username);
    };
    getUsername();
  }, []);

  useEffect(() => {
    // Fetch templates from backend
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

  useEffect(() => {
    // Fetch XP, start value, and end value
    const fetchData = async () => {
      const _xp = parseInt(await AsyncStorage.getItem('xp')) || 0;
      const _startValue = parseInt(await AsyncStorage.getItem('initXP')) || 0;
      const _endValue = parseInt(await AsyncStorage.getItem('nextCutoff')) || 100;

      console.log(`XP: ${_xp}, Start: ${_startValue}, End: ${_endValue}`);

      setXp(_xp);
      setStartValue(_startValue);
      setEndValue(_endValue);

      // Calculate progress
      if (_endValue > _startValue) {
        const progress = (_xp - _startValue) / (_endValue - _startValue);
        setProgress(Math.round(progress * 100) / 100);
      }
      if (_startValue === 0) {
        setProgress((_xp / _endValue)); 
      }
    };
    fetchData();
  }, []); // Run only once on component mount

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>My Workout</Text>
        </View>

        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={progress}  // Dynamic progress value
            width={340}
            height={10}
            borderRadius={5}
            color="#FF0000"
            unfilledColor="white"
            style={styles.bar}
          />
        </View>

        <Text style={styles.msg}>Looking strong, {username}!</Text>

        <View style={styles.workouts}>
          {Object.keys(templates).map((templateName) => (
            <TouchableOpacity
              key={templateName}
              style={styles.templateButton}
              onPress={() =>
                navigation.navigate('TemplateDetail', {
                  username: username,
                  template: templateName,
                  exercises: templates[templateName].exercises,
                })
              }
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
          style={styles.plus}
        >
          <Text style={styles.plusTxt}>+</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginLeft: 20,
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
    marginLeft: -20,
    width: '120%',
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
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'American Typewriter',
  },
  errorContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  workouts: {
    marginTop: 20,
  },
  plus: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  plusTxt: {
    fontSize: 40,
    alignSelf: 'center',
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  bar: {
    marginTop: 10,
  },
});

export default HomeScreen;
