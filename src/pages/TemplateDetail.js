import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TemplateDetail = ({navigation}) => {
  const route = useRoute();
  const { username, template, exercises } = route.params; // Access template data passed from HomeScreen

  
  const [templateInfo, setTemplateInfo] = useState({template, exercises});

  useEffect(() => {
    // This will set the data if you want to update state later based on new data or something else
    setTemplateInfo({ template, exercises });
  }, [template, exercises]);


  const handleBefore = () =>{
    navigation.navigate("BottomNavigator", {username: username});
  }


  return (
    <View style={styles.container}>
        <View style = {styles.headerCont}>
          <Text style={styles.templateName}>{templateInfo.template}</Text>
        </View>

        <Text style = {styles.exerciseHead}>Exercises </Text>
        
        <View style = {styles.group}>
            {templateInfo.exercises.map((exercise, index)=>(
                <View key = {index} style = {styles.exerciseContainer}>
                  <Text key = {index} style = {styles.exerciseTxt}>{exercise}</Text>
                </View>
            ))}
        
          <TouchableOpacity
            style = {styles.before}
            onPress={handleBefore}
          >
            <Text style = {styles.bef}>Back</Text>
          </TouchableOpacity>
        </View>
            
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171c17',
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: 'white',
  },
  templateName: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
    position:'absolute',
    // fontFamily:'American Typewriter',
    fontStyle:'italic',
    alignItems:'center',
  },
  templateDescription: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
  },
  exerciseHead:{
    position:'absolute',
    fontSize:40,
    color:'white',
    top:120,
    fontFamily:'American Typewriter',
    textAlign:'center',

  },
  group:{
    position:'absolute',
    top:190,
    textAlign:'center',

  },
  exerciseContainer: {
    fontSize: 24,
    color: '#f2f2f2', // Light grey for text contrast against the dark background
    fontFamily: 'American Typewriter',
    marginBottom: 12,
    justifyContent:'center',
    alignItems:'center',
    width:200,
    height:50,
    borderRadius: 8,
    backgroundColor: '#333', // Soft background for each exercise item
    // textAlign: 'center', // Center text to align it neatly
    marginHorizontal: 10, // Horizontal spacing between items
    elevation: 4, // Add subtle shadow for depth on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  exerciseTxt:{
    fontSize: 24,
    color: '#f2f2f2', // Light grey for text contrast against the dark background
    fontFamily: 'American Typewriter',
    textAlign: 'center',
    
  },
  headerCont: {
    backgroundColor: 'black',
    paddingVertical: 10,
    marginLeft:-20,
    width:'120%',
    height:70,
    position:'absolute',
    top:0,
    justifyContent:'center',
    textAlign:'center',
    alignItems:'center',
  },
  before:{
    marginTop:20,
    width:190,
    height:50,
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:5,
    position:'relative',
    marginLeft:15,
  },
  bef:{
    fontSize:28,
    fontFamily:'American Typewriter',
  }

});

export default TemplateDetail;
