import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View } from 'react-native';
import Header from "../../components/Header";
import Memories from "./memories";
import Calendar from "./calendar";
import Questions from "./questions";
import Notes from "./notes";
import Transcript from "./transcript";


const Tab = createMaterialTopTabNavigator();

export default function TabLayout() {
    return (
        <SafeAreaProvider>
            <Header />
            <Tab.Navigator
                screenOptions={{
                    tabBarScrollEnabled: true,
                    tabBarLabelStyle: {
                        fontSize: 14,
                        fontWeight: 'normal',
                        textTransform: 'none',
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: '#063970', // dark turquoise
                        height: 3,
                        borderRadius: 2,
                    },
                    tabBarStyle: {
                        backgroundColor: '#f0f0f0',
                        elevation: 0,
                        borderBottomWidth: 1,
                        borderBottomColor: '#f0f0f0',
                    },
                    tabBarActiveTintColor: '#063970', // dark turquoise
                    tabBarInactiveTintColor: 'gray',
                }}
            >
                <Tab.Screen name="Memories" component={Memories} />
                <Tab.Screen name="Calendar" component={Calendar} />
                <Tab.Screen name="Questions" component={Questions} />
                <Tab.Screen name="Notes" component={Notes} />
                <Tab.Screen name="Transcript" component={Transcript} />
            </Tab.Navigator>
        </SafeAreaProvider>
    );
}