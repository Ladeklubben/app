// Create reactive state using $state rune
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

// Shows an error dialog with red styling
export const showError = (title: string = "Error", message: string) => {
	setDialog(title, message, "error");
};

// Shows a success dialog with blue styling
export const showSuccess = (title: string = "Success", message: string) => {
	setDialog(title, message, "success");
};

// Wrapper for info dialog to use success styling
export const showInfo = (title: string = "Info", message: string) => {
	showSuccess(title, message);
};

// Shows a warning dialog with amber styling
export const showWarning = (title: string = "Warning", message: string) => {
	setDialog(title, message, "warning");
};

export const closeDialog = () => {
	dialogState.isOpen = false;
};