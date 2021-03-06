import { PaymentRequestParams } from 'react-payment-request-api';

const details: PaymentDetailsInit = {
  displayItems: [{
    label: 'Original donation amount',
    amount: { currency: 'USD', value: '65.00' },
  }, {
    label: 'Friends and family discount',
    amount: { currency: 'USD', value: '-10.00' },
  }, {
    label: 'Delivery tax',
    pending: true,
    amount: { currency: 'USD', value: '10.00' },
  }],
  total: {
    label: 'Total due',
    amount: { currency: 'USD', value : '55.00' },
  },
};

const getConfig = (supportedPaymentCards: string[], onShowSuccess: () => void) => ({
  methodData: [
    {
      supportedMethods: ['basic-card'],
      data: {
        supportedNetworks: ['visa', 'mastercard', 'diners'],
      },
    },
    {
      supportedMethods: ['https://android.com/pay'],
      data: {
        merchantId: 'fake',
        environment: 'TEST',
        allowedCardNetwork: ['AMEX', 'MASTERCARD', 'VISA', 'DISCOVER'],
        paymentMethodTokenizationParameters: {
          tokenizationType: 'GATEWAY_TOKEN',
          parameters: {
            'gateway': 'stripe',
            'stripe:publishableKey': 'fake',
            'stripe:version': '2016-07-06'
          },
        },
      },
    },
    {
      supportedMethods: 'https://apple.com/apple-pay',
      data: {
          version: 3,
          merchantIdentifier: 'merchant.com.example',
          merchantCapabilities: ['supportsDebit'],
          supportedNetworks: ['masterCard', 'visa'],
          countryCode: 'US',
      },
    },
  ],
  details: details,
  options: {
    requestShipping: true,
    requestPayerEmail: true,
    requestPayerPhone: true,
  },
  onShowSuccess: (result, resolve, reject): void => {
    /* tslint:disable-next-line:no-console */
    console.log('Result:', result);
    // make the payment
    setTimeout(() => { onShowSuccess(); resolve(); }, 2000);
  },
  /* tslint:disable-next-line:no-console */
  onShowFail: (error) => console.log('Error', error),
  onShippingAddressChange: (request, resolve, reject): void => {
    /* tslint:disable-next-line:no-console */
    console.log('ShippingAddress:', request.shippingAddress);
    // recalculate details
    details.shippingOptions = [{
      id: 'all',
      label: 'Wherever you want for free',
      amount: { currency: 'USD', value: '0.00' },
      selected: true
    }];
    details.displayItems![2] = {
      label: 'Tax',
      pending: false,
      amount: { currency: 'USD', value: '8.00' },
    };
    resolve(details);
  },
  onShippingOptionChange: (request, resolve, reject): void => {
    resolve(details);
  },
  // tslint:disable-next-line:no-any
  onMerchantValidation: (event: any): void => {
    event.complete(Promise.resolve(event.validationURL));
  },
}) as PaymentRequestParams;

export default getConfig;
