// Mock Twilio service for development/testing
const mockTwilio = {
  messages: {
    create: async ({ body, to }) => {
      console.log(`Mock SMS sent to ${to}: ${body}`);
      return {
        sid: 'mock_message_sid',
        status: 'sent'
      };
    }
  }
};

module.exports = mockTwilio;
