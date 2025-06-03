import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    background: {
        backgroundColor: "#f0f0f0",
    },
    headerTop: {
        marginHorizontal: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hBox: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    vBox: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    shadowBox: {
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
        borderRadius: 8,
        backgroundColor: 'white',
        marginHorizontal: '5%',
        padding: 10,
    },
    eventBox: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        elevation: 2,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        marginHorizontal: '3%',
        padding: 10,
    },
    normal: {
        fontSize: 13,
        fontWeight: 'normal',
    },
    bold: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 18,
        fontWeight: 'normal',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'normal',
    },
    subtitle: {
        fontSize: 13,
        fontWeight: 'normal',
    },
    faint: {
        fontSize: 12,
        fontWeight: 'normal',
        color: 'grey',
    },

});