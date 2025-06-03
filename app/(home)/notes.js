import { Text, View } from "react-native";
import styles from "../../styles";

export default function Notes() {
    return (
        <View
            style={[styles.background, {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }]}
        >
            <Text>Notes</Text>
        </View>
    );
}