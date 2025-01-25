import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, TextInput, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import back from '../../assets/back.jpg';

const Register = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');


    const handleRegister = async (e) => {
        if (!email && !password) {
            setError("Please fill out both the fields.");
            return;
        }
        else if (!email) {
            setError("Please fill out the email field.");
            return;
        }
        else if (!password) {
            setError("Please fill out the password field.");
            return;
        }
        // 50 characters
        // 100 characters
        // min 8 characters
        else if(username.length > 50)
        {
            setError("Please enter less than 50 characters for username");
            return;
        }
        else if(email.length > 100)
        {
            setError("Please enter less than 100 characters for email");
            return;
        }
        else if(password.length < 8)
        {
            setError("Please enter at least 8 characters for password");
            return;
        }


        try {
            console.log("tring");
            const awaitedUrl = await AsyncStorage.getItem('backendUrl');
            console.log(`${awaitedUrl} uel`);
            const response = await fetch(`${awaitedUrl}/users`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username: username, password: password, email: email }),
			});
            const res = await response.json();
            if(response.ok) {
                console.log("Login Success: ");
                navigation.navigate('Login');
            } else {
                setError(res["error"]);
            }    
        } catch (err) {
            console.log(err)
        }
    }
    


    return (
        <SafeAreaView style={styles.container}
        >
            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContainer}
                enableOnAndroid
            >

                <View style={styles.header}>
                    <ImageBackground
                        source={back}
                        resizeMethod="cover"
                        style={styles.headerbackground}>

                        <View style={styles.stuff}>
                            <Text style={styles.headertxt}>
                                Sign Up
                            </Text>

                            <Text style={styles.headercontent}>
                                Please enter your details to sign up.
                            </Text>
                        </View>

                    </ImageBackground>

                </View>

                <View style={styles.form}>
                    <View style={styles.err}>
                        {error ? <Text style={styles.error}>{error}</Text> : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Name *</Text>
                        <TextInput
                            style={styles.input}
                            label="Username"
                            type="text"
                            placeholder='Enter your name...'
                            placeholderTextColor="gray"
                            onChangeText={(text) => setUsername(text)}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            label="Email"
                            type="email"
                            placeholder='Enter your email...'
                            placeholderTextColor="gray"
                            onChangeText={(text) => setEmail(text)}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password *</Text>
                        <TextInput
                            style={styles.input}
                            label="Password"
                            placeholder='*********'
                            placeholderTextColor="gray"
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry={true}
                        />
                    </View>


                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegister}
                    >
                        <Text style={styles.buttonTxt}>Register</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.account}
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={styles.acctText}>Already have an account?</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgray',
        display: 'flex',
    },
    header: {
        flex: 0.5,
        flexDirection: 'column',
    },
    headerbackground: {
        width: 'auto',
        height: 300,

    },
    stuff: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 150,
    },
    headertxt: {
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 25,
        marginTop: -10,
        marginBottom: 10,
        fontWeight: 700,
    },
    headercontent: {
        color: 'white',
        bottom: -20,
        position: 'absolute',
    },
    input: {
        width: 300,
        height: 50,
        borderColor: '#c5c9d1',
        marginBottom: 20,
        borderWidth: 2,
        paddingLeft: 5,
        borderRadius: 10,
        color: "#333",
        fontSize: 15,

    },
    label: {
        marginBottom: 3,
        fontWeight: 'bold',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    form: {
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: 300,
        height: 50,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonTxt: {
        fontSize: 20,
        color: 'white',
        fontWeight: '400',
    },
    account:
    {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    inputContainer: {
        alignItems: 'flex-start',
        marginBottom: -10,
    },
    acctText: {
        fontSize: 15,
        color: '#0750f7',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    err: {
        marginBottom: 10,
        marginTop: -17,
    }

})

export default Register;