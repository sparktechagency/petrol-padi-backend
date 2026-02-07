export const ENUM_USER_ROLE = {
  CUSTOMER: 'Customer',
  SUPPLIER: 'Supplier',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super_Admin'
};

export const ENUM_ORDER_STATUS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  ON_THE_WAY: 'On_The_Way',
  COMPLETED: 'Completed',
  CONFIRMED: 'Confirmed',
  CANCELED: 'Canceled',
  REJECTED: 'Rejected'
};

export const ENUM_FUEL_TYPE = {
  FUEL: 'Fuel',
  DIESEL: 'Diesel'
}

export const ENUM_PAYMENT_STATUS = {
  PENDING : "Pending",
  SUCCESS : "Success",
  FAILED : "Failed",
  REFUND_PENDING: "Refund_pending",
  REFUNDED : "Refunded",
}

export const ENUM_PAYOUT_STATUS = {
  NOT_ELIGIBLE : "NOT_ELIGIBLE",
  ELIGIBLE : "ELIGIBLE",
  PAYOUT_PENDING : "PAYOUT_PENDING",
  PAYOUT_PROCESSING : "PAYOUT_PROCESSING",
  PAYOUT_SUCCESS : "PAYOUT_SUCCESS",
  PAYOUT_FAILED : "PAYOUT_FAILED",
  SETTLED : "SETTLED"
}




export const ENUM_USER_STATUS = {
  IN_PROGRESS: 'in-progress',
  BLOCKED: 'blocked',
};

export const ENUM_TRANSACTION_TYPE = {
  PURCHASE_SUBSCRIPTION: 'Purchase Subscription',
  RENEW_SUBSCRIPTION: 'Review Subscription',
  COLLABORATION: 'Collaboration',
  TRANSFER: 'Transfer',
};

export const ENUM_TRANSACTION_STATUS = {
  PENDING: 'Pending',
  SUCCESS: 'Success',
};

export const ENUM_PAYMENT_PURPOSE = {
  PURCHASE_SUBSCRIPTION: 'purchase-subscription',
  RENEW_SUBSCRIPTION: 'renew-subscription',
  COLLABRATE_PAYMENT: 'collabrate-payment',
};

export const ENUM_INCIDENT_TYPE = {
  UNPROFESSIONAL_BEHAVIOR: 'Unprofessional Behavior',
  FAILURE_TO_COLLABORATE: 'Failure to collaborate',
  SPAM: 'Spam',
  OTHER: 'Other',
};

export const ENUM_COLLABORATION_STATUS = {
  PENDING: 'pending',
  UPCOMING: 'upcoming',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};

export const ENUM_LOCATION_TYPE = {
  CITY: 'city',
  STATE: 'state',
  COUNTRY: 'country',
};
