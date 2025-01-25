import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const Welcome = ({ navigation }) => {
  const route = useRoute();
  const { username } = route.params;

  useEffect(() => {
    // Check if token exists in AsyncStorage and if user is authenticated
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        // If no token, navigate to Login screen
        navigation.navigate('Login');
      }
    };

    // Call the checkToken function
    checkToken();
  }, []); // Empty dependency array to run once when the component is mounted


  const handleSignOut = async () => {
    // Remove the token on sign out
    await AsyncStorage.removeItem("token");
    navigation.navigate('Login');
  };
  
  return (
        <View
            // source={require('../../assets/unc.gif')}
            style={styles.container}
            resizeMode="cover">
            <TouchableOpacity
                style={styles.signout}
                onPress={handleSignOut}>
                <Text style={styles.txt}>Sign Out</Text>
            </TouchableOpacity>

            <View style = {styles.overlay}>
                <Text style={styles.text}>Welcome to Pump Pal {username}!</Text>

                <Text style={styles.des}>Ready to get swole?💪</Text>

                <Text style={styles.questions}>
                    Answer a few questions to get your customized workout routine!
                </Text>
                
                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("Question1", {username: username})}>
                        <Text style={styles.swole}>Get Swole!🏋️‍♂️</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("HomeScreen", { username: username })}>
                        <Text style={styles.thanks}>No Thanks!</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor:'#171c17',
  },
  overlay:{
    marginTop:-30,
  },
  signout: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 10,
    marginTop: 10,
  },
  txt: {
    color: 'white',
    fontSize: 20,
    color: 'white',
    fontFamily: 'American Typewriter',
  },
  text: {
    color: 'white',
    justifyContent: 'center',
    marginTop: 120,
    fontSize: 45,
    alignSelf: 'center',
    fontFamily: 'American Typewriter',
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    padding: 10,
    textTransform: 'uppercase',
    lineHeight: 45,
    textAlign: 'center',
  },
  questions: {
    fontSize: 18,
    color: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 40,
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: 2,
    fontStyle:'italic',
  },
  des: {
    justifyContent: 'center',
    alignSelf: 'center',
    color: 'white',
    marginTop: 20,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
    fontStyle:'italic',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    width:200,
    height:50,
    justifyContent:'center',
    alignSelf:'center',
    marginBottom:20,
    borderRadius:20,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  buttons:{
    marginTop:50,
  },
  swole:{
    fontSize:23,
    fontFamily: 'American Typewriter',
    fontWeight: '600',
    letterSpacing: 2,
    color:'white',
  },
  thanks:{
    fontSize:23,
    fontFamily: 'American Typewriter',
    fontWeight: '600',
    letterSpacing: 2,
    color:'white',
  },
});

export default Welcome;
