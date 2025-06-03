import { Text, View } from "react-native";
import styles from "../../styles";

export default function Transcript() {
    return (
        <View
            style={[styles.background, {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }]}
        >
            <Text>Transcript</Text>
        </View>
    );
}