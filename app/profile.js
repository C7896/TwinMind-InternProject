import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Pressable, Image } from 'react-native';
import { useNavigation } from 'expo-router';
import auth from '@react-native-firebase/auth';
import styles from '../styles';
import { fetchGoogleUserProfile } from '../helper';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await fetchGoogleUserProfile();
                setProfile(profileData);
            } catch (error) {
                console.error('Error loading profile:', error);
            }
        };
        fetchProfile();
    }, []);
    const router = useNavigation();
    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <View style={{
                height: '100%',
                width: '100%',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignContent: 'center',
            }}>
                <View>
                    <Image
                        source={
                                profile?.picture
                                    ? { uri: profile.picture }
                                    : require('../assets/images/google.png')
                                }
                        style={{ flex: 1, width: '50%', alignSelf: 'center', borderRadius: 100, margin: 20 }}
                    />
                </View>
                <Text style={[styles.title, { alignSelf: 'center', marginBottom: 20 }]}>Welcome back!</Text>
                <Pressable
                    onPress={() => {
                        auth().signOut().then(() => console.log('User signed out'));
                        router.navigate('index');
                    }}
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
                    <Text style={styles.normal}>Sign Out</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}