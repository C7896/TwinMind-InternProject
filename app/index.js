import { SafeAreaView, Text, View, Image, Pressable } from "react-native";
import { useNavigation, Redirect } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles';
import React, { useEffect, useState } from 'react';
import {
    GoogleSignin,
    isErrorWithCode,
    isSuccessResponse,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import {
    GoogleAuthProvider,
    getAuth,
    onAuthStateChanged,
    signInWithCredential
} from '@react-native-firebase/auth';
import { exchangeAuthCodeForTokens } from '../helper';

export default function Index() {
    // prevent back navigation
    const navigation = useNavigation();
    useEffect(() =>
        navigation.addListener('beforeRemove', (e) => {
            if (e.data.action.type === "GO_BACK") {
                e.preventDefault();
            }
        }),
    );
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    const signIn = async () => {
        GoogleSignin.configure({
            webClientId: "557617230789-603ir7scgosjc7isa6s3ml5qu3qinihv.apps.googleusercontent.com",
            offlineAccess: true,  // enables serverAuthCode
            forceCodeForRefreshToken: true,
            scopes: ['email', 'profile',
                'https://www.googleapis.com/auth/calendar.events.readonly'],
        });
        try {
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            // Get the users ID token
            const response = await GoogleSignin.signIn();
            if (isSuccessResponse(response)) {

                await exchangeAuthCodeForTokens(response.data.serverAuthCode);
                // Create a Google credential with the token
                const googleCredential = GoogleAuthProvider.credential(response.data?.idToken);
                // Sign-in the user with the credential
                return signInWithCredential(getAuth(), googleCredential);
            }
            else {
                console.log('User cancelled sign-in');
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        // operation (eg. sign in) already in progress
                        console.log('Error: sign in already in progress');
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        // Android only, play services not available or outdated
                        console.log('Error: play services not available or outdated');
                        break;
                    default:
                        // some other error happened
                        console.log('Error: some other google sign in error:', error);
                }
            } else {
                // an error that's not related to google sign in occurred
                console.log('Error: some error unrelated to google sign in');
            }
        }
    };

    // Handle user state changes
    function handleAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    if (!user) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <LinearGradient
                    colors={["#2B4865", "#537188", "#F6C28B"]}
                    style={{
                        width: '100%',
                        height: '100%',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <View style={{ flex: 3, justifyContent: 'flex-end' }}>
                        <Image source={require('../assets/images/twinMind.png')} />
                    </View>
                    <View style={{ flex: 3, justifyContent: 'center', width: '100%' }}>
                        <Pressable
                            onPress={signIn}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignContent: 'center',
                                borderRadius: 20,
                                backgroundColor: 'white',
                                elevation: 3,
                                paddingVertical: 15,
                                marginHorizontal: '15%',
                                marginBottom: 25,
                            }}
                        >
                            <Image
                                source={require('../assets/images/google.png')}
                                style={{ width: 20, height: 20, marginRight: 10 }}
                            />
                            <Text style={styles.normal}>Continue with Google</Text>
                        </Pressable>
                    </View>
                </LinearGradient>
            </SafeAreaView>
        );
    }
    else {
        return <Redirect href="/memories" />;
    }
}