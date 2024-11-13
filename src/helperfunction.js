export const validateEmail = (mail_id) => {
    if (!mail_id.includes('@')) return false
    const parts = mail_id.split('@')
    if (parts.length !== 2 || !parts[1].includes('.') || parts[1].length < 5) return false
    
    return parts[1].split('.').every(part => part.length > 1)
}

export const validatePassword = (password) => {
    if (password.length < 7) return false
    let hasUpper = false, hasSpecial = false
    for (let char of password) {
    if (char === char.toUpperCase() && isNaN(char)) hasUpper = true
    if (!/[a-zA-Z0-9]/.test(char)) hasSpecial = true
    }
    return hasSpecial && hasUpper
};