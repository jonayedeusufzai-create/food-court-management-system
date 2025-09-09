const nodemailer = require('nodemailer');

// Create transporter for sending emails
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send verification email
const sendVerificationEmail = async (email, token) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email - TheTreeHousse',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b35;">Welcome to TheTreeHousse!</h2>
          <p>Thank you for registering with our Food Court Management System.</p>
          <p>Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #ff6b35; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p>If the button doesn't work, you can also copy and paste this link in your browser:</p>
          <p>${verificationUrl}</p>
          <p style="color: #666; font-size: 14px;">
            If you didn't create an account with us, please ignore this email.
          </p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            © ${new Date().getFullYear()} TheTreeHousse. All rights reserved.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Function to send order confirmation email
const sendOrderConfirmationEmail = async (email, orderDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Confirmation - #${orderDetails.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b35;">Order Confirmation</h2>
          <p>Thank you for your order! Here are the details:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Order #${orderDetails.orderNumber}</h3>
            <p><strong>Date:</strong> ${new Date(orderDetails.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${orderDetails.status}</p>
          </div>
          
          <h3>Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #e9ecef;">
                <th style="text-align: left; padding: 10px; border: 1px solid #ddd;">Item</th>
                <th style="text-align: center; padding: 10px; border: 1px solid #ddd;">Quantity</th>
                <th style="text-align: right; padding: 10px; border: 1px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderDetails.items.map(item => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                  <td style="text-align: center; padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
                  <td style="text-align: right; padding: 10px; border: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="text-align: right; margin: 20px 0;">
            <h3>Total: $${orderDetails.totalAmount.toFixed(2)}</h3>
          </div>
          
          <p>We'll notify you when your order status changes.</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            © ${new Date().getFullYear()} TheTreeHousse. All rights reserved.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendOrderConfirmationEmail
};