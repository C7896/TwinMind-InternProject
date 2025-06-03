import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, FlatList, ActivityIndicator } from 'react-native';
import { getValidAccessToken } from '../../helper';
import styles from '../../styles';

export default function Calendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchFutureCalendarEvents(accessToken) {
        let allEvents = [];
        let nextPageToken = null;

        do {
            const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
            url.searchParams.set('timeMin', new Date().toISOString()); // future events only
            url.searchParams.set('singleEvents', 'true');              // expands recurring events
            url.searchParams.set('maxResults', '2500');                // max per page
            url.searchParams.set('showDeleted', 'false');              // skip deleted
            url.searchParams.set('orderBy', 'startTime');              // sort ascending

            if (nextPageToken) {
                url.searchParams.set('pageToken', nextPageToken);
            }

            const response = await fetch(url.toString(), {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Failed to fetch events:', data);
                return [];
            }

            allEvents = allEvents.concat(data.items || []);
            nextPageToken = data.nextPageToken;
        } while (nextPageToken);

        return allEvents;
    }

    useEffect(() => {
        const loadEvents = async () => {
            const token = await getValidAccessToken();
            if (!token) {
                console.log('No Google access token available');
                setLoading(false);
                return;
            }

            try {
                let futureEvents = await fetchFutureCalendarEvents(token);
                setEvents(futureEvents || []);
            } catch (err) {
                console.log('Failed to fetch calendar events:', err);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, []);

    if (loading) return <ActivityIndicator />;

    // format for section list
    function splitMultiDayEvents(events) {
        const splitEvents = [];

        events.forEach(event => {
            const startDateStr = event.start?.date || event.start?.dateTime;
            const endDateStr = event.end?.date || event.end?.dateTime;

            if (!startDateStr || !endDateStr) return; // skip invalid events

            const isAllDay = !!event.start?.date;

            const startDate = new Date(startDateStr);
            const endDate = new Date(endDateStr);

            // Calculate number of days
            const daysSpan = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

            if (daysSpan <= 1) {
                splitEvents.push(event);
            } else {
                for (let i = 0; i < daysSpan; i++) {
                    const date = new Date(startDate);
                    date.setDate(date.getDate() + i);
                    const dateOnly = date.toISOString().split('T')[0];

                    splitEvents.push({
                        ...event,
                        id: `${event.id}_${i}`, // ensure unique ID
                        start: isAllDay
                            ? { date: dateOnly }
                            : { dateTime: new Date(date).toISOString() },
                        end: isAllDay
                            ? { date: dateOnly }
                            : { dateTime: new Date(date).toISOString() },
                    });
                }
            }
        });

        return splitEvents;
    }

    const sortData = (data) => {
        const grouped = {};

        data.forEach((item) => {
            let date = item.start.date || (item.start.dateTime ? item.start.dateTime.split('T')[0] : null);
            if (!date) return;

            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(item);
        });

        const sortedDates = Object.keys(grouped).sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );

        return sortedDates.map((date) => ({
            title: date,
            data: grouped[date].sort(
                (a, b) =>
                    new Date(b.start.dateTime || b.start.date).getTime() -
                    new Date(a.start.dateTime || a.start.date).getTime()
            ),
        }));
    };


    function formatDateReadable(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',   // "Mon"
            month: 'long',      // "June"
            day: 'numeric',     // "14"
            year: 'numeric'     // "2025"
        });
    }

    let splitEvents = splitMultiDayEvents(events);
    let sortedEvents = sortData(splitEvents);

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
                    sections={sortedEvents}
                    keyExtractor={(item, index) => item.summary + index}
                    renderItem={({ item }) => {
                        const start = item.start.dateTime || item.start.date;
                        const end = item.end?.dateTime || item.end?.date;

                        const startTime = item.start.dateTime
                            ? new Date(start).toLocaleTimeString([], {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                            })
                            : 'All Day';
                        const endTime = item.end?.dateTime
                            ? ' - ' + new Date(end).toLocaleTimeString([], {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                            })
                            : '';
                        return (
                            <View style={[styles.eventBox]}>
                                <View
                                    style={{
                                        backgroundColor: 'gray',
                                        borderRadius: 10,
                                        height: '100%',
                                        width: 5,
                                        marginRight: 5,
                                    }}
                                />
                                <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                                    <Text style={[styles.subtitle, { fontWeight: 'bold' }]} numberOfLines={2} ellipsizeMode="tail">{item.summary}</Text>
                                    <Text style={styles.faint}>{startTime}{endTime}</Text>
                                </View>
                            </View>
                        );
                    }}
                    renderSectionHeader={({ section }) => (
                        <Text style={[styles.sectionTitle]}>
                            {formatDateReadable(section.title)}
                        </Text>
                    )}
                    SectionSeparatorComponent={() => <View style={{ height: 24 }} />}
                    ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                />
            </View>
        </View>
    );
}