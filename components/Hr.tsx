import { View } from "react-native"
import Colours from "./Colours"

export default function() {
  return (
    <View
      style={{
        borderBottomColor: Colours.foreground,
        borderBottomWidth: 2,
        margin: "5%",
      }}
    />
  )
}
