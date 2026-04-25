import { StyleSheet } from 'react-native';
import Colours from '@/components/Colours';

const CONTAINER_MARGINS = 10;
const BORDER_WIDTH = 3;
const BORDER_RADIUS = 15;

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
		borderWidth: BORDER_WIDTH,
		borderColor: Colours.active_border_color,
		borderRadius: BORDER_RADIUS,
		paddingBottom: 15,
		margin: CONTAINER_MARGINS,
	},
	container: {
		backgroundColor: Colours.selection_background,
		borderWidth: BORDER_WIDTH,
		borderColor: Colours.active_border_color,
		borderRadius: BORDER_RADIUS,
		margin: CONTAINER_MARGINS,
	},
	mainButton: {
		borderRadius: BORDER_RADIUS,
	}
});
