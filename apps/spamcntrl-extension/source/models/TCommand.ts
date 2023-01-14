type TCommand =
  | 'login'
  | 'signup'
  | 'resetPassword'
  | 'auth'
  | 'logout'
  | 'login_google'
  | 'updateUserFirebase'
  | 'getUserFirebase'
  | 'stripeCustomersAddPaymentMethod'
  | 'getStripeCustomer'
  | 'getPaymentMethod'
  | 'createPayment'
  | 'getLogs'

export default TCommand
