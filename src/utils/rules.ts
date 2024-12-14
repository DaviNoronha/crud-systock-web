export const validateEmail = [
    (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "E-mail inválido",
];

export const validatePassword = [
    (v: string) => (v && v.length >= 8) || 'Senha precisa ter ao menos 8 caracteres',
];
