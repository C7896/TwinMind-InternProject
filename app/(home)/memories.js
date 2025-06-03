import { useEffect } from 'react';
import { SectionList, Text, View } from "react-native";
import { useNavigation } from 'expo-router';
import styles from "../../styles";

const rawData = [
    {
        date: 'Thu Jun 5 2025',
        time: '2:51 PM',
        title: "TwinMind Intern Contract Finalization and Signing with Chev",
        duration: '4m',
    },
    {
        date: 'Thu Jun 5 2025',
        time: '2:38 PM',
        title: "TwinMind Hiring Discussion with Chev",
        duration: '13m',
    },
    {
        date: 'Thu Jun 5 2025',
        time: '2:30 PM',
        title: "TwinMind Intern Project Evaluation Discussion with Chev",
        duration: '8m',
    },
    {
        date: 'Mon May 12 2025',
        time: '9:11 PM',
        title: "TwinMind App Development Discussion and Public Speaking Practice",
        duration: '1h 42m',
    },
    {
        date: 'Sat May 10 2025',
        time: '10:32 AM',
        title: "TwinMind AI App Overview: Founder's Conversation About Product Features, Glksdjflksdjdlksdlkd",
        duration: '21m',
    },
    {
        date: 'Fri May 9 2025',
        time: '9:25 PM',
        title: "TwinMind Feature Discussion: Audio Saving Options, UI Simplification, and Codslkjfalksdjflkdsdsdaf",
        duration: '27m',
    },
    {
        date: 'Fri May 9 2025',
        time: '1:29 PM',
        title: "TwinMind Product Strategy and UX Improvement Discussion with Rith, Deldsakjflksadjflksjd",
        duration: '7h 16m',
    },
];

const sortData = (data) => {
    const grouped = {};

    data.forEach((item) => {
        if (!grouped[item.date]) {
            grouped[item.date] = [];
        }
        grouped[item.date].push(item);
    });

    const sortedDates = Object.keys(grouped).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    return sortedDates.map((date) => ({
        title: date,
        data: grouped[date].sort(
            (a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime()
        ),
    }));
};

const DATA = sortData(rawData);

export default function Memories() {
    // prevent back navigation
    const navigation = useNavigation();
    useEffect(() =>
        navigation.addListener('beforeRemove', (e) => {
            if (e.data.action.type === "GO_BACK") {
                e.preventDefault();
            }
        }),
    );
    return (
        <View style={[styles.background, {
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "flex-start",
            marginTop: '2%',
            marginHorizontal: '5%',
            marginBottom: '10%',
        }]}>
            <View style={{ width: '100%' }}>
                <SectionList
                    sections={DATA}
                    keyExtractor={(item, index) => item.title + index}
                    renderItem={({item}) => (
                        <View style={[styles.shadowBox]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.faint}>{item.time}</Text>
                                </View>
                                <View style={{ flex: 6 }}>
                                    <Text style={styles.subtitle} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.faint}>{item.duration}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    renderSectionHeader={({ section: {title} }) => (
                        <Text style={[styles.sectionTitle]}>{title}</Text>
                    )}
                    SectionSeparatorComponent={() => <View style={{ height: 24 }} />}
                    ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                />
            </View>
        </View>
    );
}