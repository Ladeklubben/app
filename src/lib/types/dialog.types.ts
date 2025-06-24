type Dialog = {
    isOpen: boolean;
    title: string;
    message: string;
    type: DialogType;
};

type DialogType = "error" | "success" | "warning" | "info";