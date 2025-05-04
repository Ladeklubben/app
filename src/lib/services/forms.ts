/**
 * Validates an email address.
 * @param email The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


/**
 * Validates a zip code.
 * @param zip The zip code to validate
 * @returns True if the zip code is valid, false otherwise
 */
export function validateZip(zip: string): boolean {
    const regex = /^\d{4}$/;
    return regex.test(zip);
}

/**
 * Validates a password.
 * @param password The password to validate
 * @returns An error message if the password is invalid, or an empty string if it is valid
 * */
export function validatePassword(password: string): string {
    if (password.length < 6) {
        return "Password must be at least 6 characters";
    }
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number";
    }
    return "";
}