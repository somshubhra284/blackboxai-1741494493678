// Mock Razorpay service for development/testing
const mockRazorpay = {
  orders: {
    create: async (options) => {
      console.log('Mock Razorpay order created:', options);
      return {
        id: 'mock_order_id',
        amount: options.amount,
        currency: options.currency
      };
    }
  },
  payments: {
    fetch: async (paymentId) => {
      console.log('Mock Razorpay payment fetch:', paymentId);
      return {
        id: paymentId,
        status: 'captured'
      };
    }
  }
};

module.exports = mockRazorpay;
