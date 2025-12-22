
export enum PaymentMethod {
  COD = 1,
  QR = 2
}

export enum Gender {
  FEMALE = 0,
  MALE = 1
}

export enum ActiveStatus {
  INACTIVE = 0,
  ACTIVE = 1
}

export enum RoleId {
  CUSTOMER = 1,
  STAFF = 2,
  ADMIN = 3
}

export enum OrderStatus {
  CANCELLED = 0,
  COMPLETED = 1,
  PENDING = 2,
  ACCEPTED = 3,
  REQ_CANCEL = 4,
  SHIPPING = 5,
  RE_DELIVERY = 6
}

export enum ServiceStatus {
  CANCELLED = 0,
  COMPLETED = 1,
  PENDING = 2,
  REQ_CANCEL = 3,
  IN_PROGRESS = 4,
  WAITING_PAYMENT = 5
}
