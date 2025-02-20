export enum UserStatusEnum {
  DEACTIVATE = 'DEACTIVATE',
  ACTIVE = 'ACTIVE',
  DELETE = 'DELETE',
}

export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum MessageEnum {
  CREATE_SUCCESS = 'Tạo thành công',
  UPDATE_SUCCESS = 'Cập nhật thành công',
  LOGIN_SUCCESS = 'Đăng nhập thành công',
  TOKEN_EXPIRED = 'Token đã hết hạn',
  PHONE_NUMBER_DUPLICATE = 'Số điện thoại đã tồn tại trong hệ thống',
  USERNAME_DUPLICATE = 'Tên người dùng đã tồn tại trong hệ thống',
  MAIL_DUPLICATE = 'Mail đã tồn tại trong hệ thống',
  PHONE_DUPLICATE = 'Số điện thoại đã tồn tại trong hệ thống',
  TOKEN_EMPTY = 'Access Token đang để trống',
  TOKEN_INVALID = 'Token sai',
  USER_NOT_FOUND = 'Không tìm thấy người dùng',
  USERNAME_PASSWORD_EMPTY = 'Tên đăng nhập và mật khẩu đang để trống',
  USERNAME_PASSWORD_WRONG = 'Tên đăng nhập và mật khẩu sai',
  NO_PERMISSION = 'Bạn không có quyền sử dụng chức năng này',
  PASSWORD_WRONG = 'Sai mật khẩu , hãy kiểm tra lại mật khẩu',
  CHANGE_PASSWORD_SUCCESS = 'Thay đổi mật khẩu thành công',
}