export const VALIDATION = {
  PASSWORD: {
    MIN: 8,
    MAX: 16,
    REGEX: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,

    MESSAGE_ERROR: {
      INVALID_PASSWORD:
        'Mật khẩu không hợp lệ, mật khẩu phải bao gồm chữ thường ít nhất 1 chữ hoa , 1 chữ thường , chứa số từ 1 đến 9 ,kí tự đặc biệt',
      PASSWORD_TOO_SHORT:
        'Mật khẩu không hợp lệ, mật khẩu quá ngắn tối thiểu 8 kí tự và tối đa 16 kí tự',
    },
  },
};
