/**
 * Reactive state for managing dialog visibility and content.
 * Contains the current dialog's open state, title, message, and type.
 */
export const dialogState = $state<Dialog>({
	isOpen: false,
	title: "",
	message: "",
	type: "error",
});

// Helper function to set the dialog state
function setDialog(title: string, message: string, type: DialogType) {
	dialogState.isOpen = true;
	dialogState.title = title;
	dialogState.message = message;
	dialogState.type = type;
}

/**
 * Shows an error dialog with red styling.
 * @param message - The error message to display. Remember to end with a period.
 * @param appendHelp - Whether to append help text about trying again or contacting support (default: true). Make sure messages end with a period.
 */
export const showError = (message: string, appendHelp: boolean = true) => {
	if (appendHelp) {
		message += " Please try again later or contact support.";
	}
	setDialog("Error", message, "error");
};

/**
 * Shows a success dialog with blue styling.
 * @param title - The title of the dialog (default: "Success")
 * @param message - The success message to display
 */
export const showSuccess = (title: string = "Success", message: string) => {
	setDialog(title, message, "success");
};

/**
 * Shows an info dialog using success styling.
 * @param title - The title of the dialog (default: "Info")
 * @param message - The info message to display
 */
export const showInfo = (title: string = "Info", message: string) => {
	showSuccess(title, message);
};

/**
 * Shows a warning dialog with amber styling.
 * @param title - The title of the dialog (default: "Warning")
 * @param message - The warning message to display
 */
export const showWarning = (title: string = "Warning", message: string) => {
	setDialog(title, message, "warning");
};

/**
 * Closes the currently open dialog by setting isOpen to false.
 */
export const closeDialog = () => {
	dialogState.isOpen = false;
};
