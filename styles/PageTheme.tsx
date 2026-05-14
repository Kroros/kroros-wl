import { StyleSheet } from 'react-native';
import Colours from '@/components/Colours';

const CONTAINER_MARGINS = 10;
const BORDER_WIDTH = 3;
const BORDER_RADIUS = 0;
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
		borderRadius: BORDER_RADIUS,
		width: "90%",
		marginLeft: "5%",
		alignItems: 'center',
	},
	mainButtonText: {
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
	},
	listSubtext: {
		color: Colours.inactive_tab_foreground,
		fontSize: 16,
		marginLeft: "10%",
	},
	redButton: {
		backgroundColor: Colours.alert,
		borderRadius: BORDER_RADIUS,
		width: "90%",
		marginLeft: "5%",
		marginTop: "2.5%",
	},
	rowContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	workoutHeader: {
		width: "100%",
		borderBottomColor: Colours.active_border_color,
		borderBottomWidth: 1,
		alignItems: 'center',
	},
	workoutHeaderText: {
		fontSize: 28,
		color: Colours.foreground,
	},
	exerciseHeader: {
		width: "100%",
		alignItems: 'center',
	},
	exerciseHeaderText: {
		fontSize: 24,
		color: Colours.foreground,
	},
	setInputFieldContainer: {
		width: "95%",
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	setInputRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: "1%",
	},
	setInputField: {
		width: "22%",
		backgroundColor: Colours.white1,
		borderColor: Colours.white0,
		borderWidth: 2,
	},
	setLabel: {
		color: Colours.foreground,
		fontSize: 20,
		fontWeight: 'bold',
		width: "22%",

	},
	arrows: {
		marginLeft: "10%",
		width: "80%",
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	arrowButton: {

	},
	summaryContainer: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: "100%"
	},
	summaryItem: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		width: "45%",
		margin: "2%",
		backgroundColor: Colours.selection_background,
		borderWidth: 2,
		borderColor: Colours.active_border_color,
	},
	summaryText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: Colours.foreground,
		marginLeft: "5%",
	},
	miniSummaryContainer: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		width: "100%",
		borderColor: Colours.white1,
		borderWidth: 1,
		marginTop: "1%",
		marginBottom: "1%",
	},
	miniSummary: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	miniSummaryLabel: {
		color: Colours.white1,
		fontSize: 18,
		fontWeight: 'bold',
		marginLeft: "5%",
	},
	miniSummaryText: {
		marginLeft: "5%",
		width: "30%",
		fontSize: 14,
		color: Colours.white0,
	},
	setLabel2:{
		color: Colours.foreground,
		fontSize: 16,
		fontWeight: 'bold',
		width: "22%",
	} 
});
