// Mock SendGrid service for development
const sendEmail = async (to, subject, html) => {
  console.log('Mock email sent:');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Content:', html);
  return { success: true };
};

module.exports = {
  sendEmail
};
