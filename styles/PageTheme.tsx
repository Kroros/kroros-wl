import { StyleSheet } from 'react-native';
import Colours from '@/components/Colours';

const CONTAINER_MARGINS = 10;
const BORDER_WIDTH = 3;
const BORDER_RADIUS = 15;
const CONTAINER_PADDING = 5;

export default StyleSheet.create({
	pageContainer: {
		backgroundColor: Colours.background,
		width: "100%",
		height: "100%",
	},
	bodyText: {
		color: Colours.foreground,
		fontSize: 18,
		marginLeft: "5%",
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
		padding: CONTAINER_PADDING,
	},
	mainButton: {
		backgroundColor: Colours.active_border_color,
		borderRadius: 5,
		width: "90%",
		marginLeft: "5%",
	},
	mainButtonText: {
		marginLeft: "25%",
		fontSize: 24,
		color: Colours.black1,
	},
	textInput: {
		fontSize: 24,
		color: Colours.foreground,
		marginLeft: "5%",
	},
	listText: {
		color: Colours.foreground,
		fontSize: 24,
		marginLeft: "10%",
	}
});
