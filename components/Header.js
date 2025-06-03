import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Image, Text, Pressable } from "react-native";
import { Bar } from 'react-native-progress';
import { useRouter } from 'expo-router';
import styles from "../styles";
import { fetchGoogleUserProfile } from '../helper';

export default function Header() {
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
    const insets = useSafeAreaInsets();
    const router = useRouter();
    return (
        <View style={[styles.background, { paddingTop: insets.top + 5, height: '24%', justifyContent: 'space-between' }]}>
            <View style={styles.headerTop}>
                <Pressable onPress={() => router.navigate('/profile')} >
                    <Image
                        source={
                            profile?.picture
                                ? { uri: profile.picture }
                                : require('../assets/images/google.png')
                            }
                        style={{ width: 30, height: 30, borderRadius: 25 }}
                    />
                </Pressable>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                    <Text style={[styles.title, { color: '#063970', /* dark turquoise */ fontWeight: 'bold' }]}>TwinMind</Text>
                    <View style={{ justifyContent: 'center', paddingHorizontal: 5, borderRadius: 10, backgroundColor: '#063970' /* dark turquoise */ }}>
                        <Text style={{ color: 'white' }}>PRO</Text>
                    </View>
                </View>
                <Text style={[styles.bold, { color: '#063970' /* dark turquoise */ }]}>Help</Text>
            </View>
            <View style={styles.shadowBox}>
                <View style={styles.hBox}>
                    <View style={styles.vBox}>
                        <Text style={[styles.normal, { color: 'darkorange', marginBottom: 10 }]}>
                            Capture 100 Hours to Unlock Features
                        </Text>
                        <Text style={[styles.title, { marginBottom: 10 }]}>Building Your Second Brain</Text>
                    </View>
                    <View>
                        <Image
                            source={require('../assets/images/brainIcon.png')}
                            style={{ width: 75, height: 75 }}
                        />
                    </View>
                </View>
                <View style={styles.hBox}>
                    <View style={{ width: '75%' }}>
                        <Bar indeterminate={false} progress={1} width={null} color={'darkorange'} />
                    </View>
                    <Text style={styles.normal}>159/100 hours</Text>
                </View>
            </View>
        </View>
    );
}