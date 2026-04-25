import { StyleSheet } from 'react-native';
import Colours from '@/components/Colours';

export default StyleSheet.create({
	pageContainer: {
		backgroundColor: Colours.background,
		width: "100%",
		height: "100%",
	},
	bodyText: {
		color: Colours.foreground,
	},
	calendar: {
		backgroundColor: Colours.active_tab_foreground,
		borderWidth: 3,
		borderColor: Colours.active_border_color,
	}
});
