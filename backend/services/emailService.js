/**
 * Email Notification Service
 * Uses nodemailer with Gmail SMTP.
 * Set EMAIL_USER and EMAIL_PASS in .env to enable.
 */
const nodemailer = require('nodemailer');
const dns = require('dns');
const axios = require('axios');

// Create transporter — gracefully disabled if credentials not set
let transporter = null;
const appBaseUrl = (process.env.FRONTEND_URL || process.env.APP_BASE_URL || 'http://localhost:5001').replace(/\/+$/, '');

function parseEmailAddress(input) {
  const value = String(input || '').trim();
  const match = value.match(/<([^>]+)>/);
  return (match ? match[1] : value).replace(/^['"]+|['"]+$/g, '').trim().toLowerCase();
}

function isResendTestMode(fromAddress) {
  return parseEmailAddress(fromAddress).endsWith('@resend.dev');
}

function getTransporter() {
  if (!transporter) {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || user === 'your-email@gmail.com' || !pass || pass === 'your-app-password') {
      console.warn('⚠️  Email service: EMAIL_USER / EMAIL_PASS not configured in .env — emails disabled.');
      return null;
    }

    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = Number(process.env.EMAIL_PORT || 587);
    const secure = String(process.env.EMAIL_SECURE || 'false').toLowerCase() === 'true';

    const forceIPv4Lookup = (hostname, options, callback) => {
      const done = typeof options === 'function' ? options : callback;
      dns.resolve4(hostname, (resolveErr, addresses) => {
        if (!resolveErr && Array.isArray(addresses) && addresses.length > 0) {
          return done(null, addresses[0], 4);
        }
        dns.lookup(hostname, { family: 4, all: false }, done);
      });
    };

    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: { user, pass },
      // CRITICAL FIX FOR RENDER: Force IPv4 connection to Gmail SMTP 
      // Node 18+ prefers IPv6 by default, but Render outbound IPv6 to Gmail often fails (ENETUNREACH)
      tls: {
          rejectUnauthorized: false
      }
    });
  }
  return transporter;
}

// ─── Helper to send a mail (swallows errors so it never breaks the API) ───────
async function sendMail(to, subject, html) {
  const t = getTransporter();
  if (!t) {
    console.warn(`⚠️  Cannot send email to ${to}: Transporter not initialized.`);
    return;
  }

  const rawFrom = process.env.EMAIL_FROM || `"Farmer Medicine Shop" <${process.env.EMAIL_USER}>`;
  const fromAddress = String(rawFrom)
    .trim()
    .replace(/^['"]+|['"]+$/g, "");

  try {
    await t.sendMail({
      from: fromAddress,
      to,
      subject,
      html
    });
    console.log(`📧 Email sent via SMTP to ${to}: ${subject}`);
  } catch (err) {
    console.error(`❌ SMTP send failed to ${to}:`, err.message);
  }
}

// ─── Order Confirmation ────────────────────────────────────────────────────────
async function sendOrderConfirmation(userEmail, userName, order) {
  const itemRows = (order.items || []).map(item => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;">${item.name}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #eee;text-align:right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const addr = order.shippingAddress || {};
  const subject = `✅ Order Confirmed — #${order._id}`;

  const html = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#2e7d32,#1b5e20);padding:32px 24px;text-align:center;">
        <div style="font-size:48px;margin-bottom:8px;">🌿</div>
        <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Order Confirmed!</h1>
        <p style="color:#a5d6a7;margin:8px 0 0;">Thank you for shopping with Farmer Medicine Shop</p>
      </div>

      <!-- Body -->
      <div style="padding:28px 24px;">
        <p style="color:#333;font-size:15px;">Hello <strong>${userName}</strong>,</p>
        <p style="color:#555;font-size:14px;">Your order has been placed successfully. Here are the details:</p>

        <!-- Order ID -->
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 18px;margin:16px 0;">
          <span style="color:#166534;font-weight:600;font-size:14px;">📦 Order ID:</span>
          <span style="color:#14532d;font-family:monospace;font-size:13px;margin-left:8px;">#${order._id}</span>
        </div>

        <!-- Items Table -->
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr style="background:#f8fffe;">
              <th style="padding:10px 8px;text-align:left;color:#374151;font-size:13px;border-bottom:2px solid #e5e7eb;">Product</th>
              <th style="padding:10px 8px;text-align:center;color:#374151;font-size:13px;border-bottom:2px solid #e5e7eb;">Qty</th>
              <th style="padding:10px 8px;text-align:right;color:#374151;font-size:13px;border-bottom:2px solid #e5e7eb;">Price</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:12px 8px;font-weight:700;color:#111;font-size:15px;">Total Payable</td>
              <td style="padding:12px 8px;text-align:right;font-weight:700;color:#1b5e20;font-size:16px;">₹${(order.totalAmount || 0).toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>

        <!-- Delivery Address -->
        <div style="background:#fafaf9;border:1px solid #e5e7eb;border-radius:10px;padding:14px 18px;margin:16px 0;">
          <p style="margin:0 0 6px;font-weight:600;color:#374151;font-size:13px;">📍 Delivery Address</p>
          <p style="margin:0;color:#555;font-size:13px;line-height:1.6;">
            ${addr.fullName} • ${addr.phone}<br/>
            ${addr.doorNumber}, ${addr.area}${addr.landmark ? ', ' + addr.landmark : ''}<br/>
            ${addr.district}, ${addr.state}, ${addr.country} - ${addr.pincode}
          </p>
        </div>

        <!-- Payment Method -->
        <div style="background:#fafaf9;border:1px solid #e5e7eb;border-radius:10px;padding:14px 18px;margin:16px 0;">
          <p style="margin:0;font-size:13px;color:#374151;">
            💳 <strong>Payment Method:</strong> ${order.paymentMethod || 'Cash on Delivery'}
          </p>
        </div>

        <p style="color:#555;font-size:13px;margin-top:20px;">We'll send you another email once your order is shipped. You can track your orders in the app.</p>
        <a href="${appBaseUrl}/order-history.html" style="display:inline-block;margin-top:16px;background:linear-gradient(135deg,#2e7d32,#1b5e20);color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;">View My Orders →</a>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:18px 24px;text-align:center;">
        <p style="margin:0;color:#9ca3af;font-size:12px;">© 2025 Farmer Medicine Shop | Made with ❤️ for Indian Farmers</p>
      </div>
    </div>
  </body>
  </html>
  `;

  await sendMail(userEmail, subject, html);
}

// ─── Order Status Update ───────────────────────────────────────────────────────
async function sendOrderStatusUpdate(userEmail, userName, order, newStatus) {
  const statusConfig = {
    Processing: { icon: '⚙️', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', message: 'Your order is now being processed by our team.' },
    Shipped: { icon: '🚚', color: '#d97706', bg: '#fffbeb', border: '#fde68a', message: 'Your order is on its way! Expect delivery soon.' },
    Delivered: { icon: '✅', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', message: 'Your order has been delivered successfully. Enjoy!' },
    Cancelled: { icon: '❌', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', message: 'Your order has been cancelled. Contact us if you have questions.' },
    Pending: { icon: '⏳', color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb', message: 'Your order is pending.' }
  };

  const cfg = statusConfig[newStatus] || statusConfig.Pending;
  const subject = `${cfg.icon} Order Status Update — #${order._id}`;

  const html = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#2e7d32,#1b5e20);padding:32px 24px;text-align:center;">
        <div style="font-size:48px;margin-bottom:8px;">${cfg.icon}</div>
        <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Order Status Updated</h1>
        <p style="color:#a5d6a7;margin:8px 0 0;">Farmer Medicine Shop</p>
      </div>

      <!-- Body -->
      <div style="padding:28px 24px;">
        <p style="color:#333;font-size:15px;">Hello <strong>${userName}</strong>,</p>

        <!-- Status Badge -->
        <div style="background:${cfg.bg};border:1px solid ${cfg.border};border-radius:12px;padding:18px 22px;margin:16px 0;text-align:center;">
          <p style="margin:0 0 4px;font-size:13px;color:#6b7280;">Your order status is now</p>
          <span style="font-size:22px;font-weight:800;color:${cfg.color};">${newStatus}</span>
        </div>

        <p style="color:#555;font-size:14px;">${cfg.message}</p>

        <!-- Order ID -->
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px 16px;margin:16px 0;">
          <span style="color:#166534;font-weight:600;font-size:13px;">📦 Order ID:</span>
          <span style="color:#14532d;font-family:monospace;font-size:13px;margin-left:8px;">#${order._id}</span>
        </div>

        <!-- Total -->
        <div style="background:#fafaf9;border:1px solid #e5e7eb;border-radius:10px;padding:12px 16px;margin:16px 0;">
          <span style="font-size:13px;color:#374151;"><strong>💰 Order Total:</strong> ₹${(order.totalAmount || 0).toLocaleString('en-IN')}</span>
        </div>

        <a href="${appBaseUrl}/order-history.html" style="display:inline-block;margin-top:16px;background:linear-gradient(135deg,#2e7d32,#1b5e20);color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;">View Order Details →</a>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:18px 24px;text-align:center;">
        <p style="margin:0;color:#9ca3af;font-size:12px;">© 2025 Farmer Medicine Shop | Made with ❤️ for Indian Farmers</p>
      </div>
    </div>
  </body>
  </html>
  `;

  await sendMail(userEmail, subject, html);
}

module.exports = { sendOrderConfirmation, sendOrderStatusUpdate };
