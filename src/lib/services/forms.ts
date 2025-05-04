/**
 * Checks if the input string is a valid email address.
 *
 * Returns `true` if the string contains characters before and after an '@' symbol and a period following the '@'; otherwise, returns `false`.
 *
 * @param email - The email address to validate.
 * @returns Whether the email address is valid.
 */
export function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


/**
 * Checks if the input string is a valid zip code consisting of exactly four digits.
 *
 * @param zip - The string to validate as a zip code.
 * @returns `true` if {@link zip} is exactly four digits, otherwise `false`.
 */
export function validateZip(zip: string): boolean {
    const regex = /^\d{4}$/;
    return regex.test(zip);
}

/**
 * Checks if a password meets minimum security requirements.
 *
 * Validates that the password is at least 6 characters long and contains at least one uppercase letter, one lowercase letter, and one digit.
 *
 * @param password - The password string to validate.
 * @returns An error message describing the first unmet requirement, or an empty string if the password is valid.
 */
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