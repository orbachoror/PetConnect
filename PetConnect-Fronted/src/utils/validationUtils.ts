export const validateName = (name: string): string | null => {
    if (!name) return "Name is required.";
    if (name.length < 2) return "Name must be at least 2 characters long.";
    if (name.length > 20) return "Name must be less than 20 characters.";
    if (!/^[a-zA-Z ]+$/.test(name)) return "Name must contain only letters.";
    return null;
}
export const validateEmail = (email: string): string | null => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required.";
    if (!emailRegex.test(email)) return "Invalid email format.";
    return null; // No error
};

export const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
        return "Password must include uppercase, lowercase, and a number.";
    }
    return null;
};

export const validateDateOfBirth = (dob: string): string | null => {
    if (!dob) return "Date of birth is required.";
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const ageLimit = 13;

    if (birthDate > today) return "Date of birth cannot be in the future.";
    if (age < ageLimit) return `You must be at least ${ageLimit} years old.`;
    return null;
};

export const validatePhone = (phone: string): string | null => {
    if (!phone) return null; // Optional field
    if (!/^\d+$/.test(phone)) return "Phone must contain only numbers.";
    if (phone.length != 10) return "Phone number must be at least 10 digits.";
    return null;
}

export const validateTitle = (title: string): string | null => {
    if (!title) return "Title is required.";
    if (title.length < 5) return "Title must be at least 5 characters long.";
    if (title.length > 50) return "Title must be less than 50 characters.";
    return null;
};

export const validateDescription = (description: string): string | null => {
    if (!description) return "Description is required.";
    if (description.length < 10) return "Description must be at least 10 characters long.";
    return null;
};