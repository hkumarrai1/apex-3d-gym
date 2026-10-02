/**
 * ==============================================================================
 * TWILIO WHATSAPP & SMS NOTIFICATION SERVICE
 * ==============================================================================
 */

export async function sendTwilioWhatsAppMessage({ toPhone, messageText }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

  // Format destination phone number to E.164 (e.g. +919971284797)
  let cleanPhone = toPhone.toString().replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = `+91${cleanPhone}`;
  } else if (!cleanPhone.startsWith('+')) {
    cleanPhone = `+${cleanPhone}`;
  }

  const formattedTo = cleanPhone.startsWith('whatsapp:') ? cleanPhone : `whatsapp:${cleanPhone}`;

  if (accountSid && authToken && !accountSid.includes('your_') && !authToken.includes('your_')) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
      const params = new URLSearchParams();
      params.append('From', fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`);
      params.append('To', formattedTo);
      params.append('Body', messageText);

      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

      const res = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });

      const data = await res.json();

      if (res.ok) {
        console.log(`[TWILIO SUCCESS] WhatsApp message sent to ${formattedTo} (SID: ${data.sid})`);
        return {
          success: true,
          mode: 'LIVE_TWILIO',
          sid: data.sid,
          recipient: formattedTo,
          message: messageText,
          sentAt: new Date()
        };
      } else {
        console.error(`[TWILIO ERROR] Status ${res.status}:`, data.message || data);
        return {
          success: false,
          mode: 'TWILIO_ERROR',
          error: data.message || 'Twilio message delivery failed',
          recipient: formattedTo
        };
      }
    } catch (err) {
      console.error(`[TWILIO NETWORK ERROR]:`, err.message);
      return {
        success: false,
        mode: 'NETWORK_ERROR',
        error: err.message
      };
    }
  }

  // Simulated / Mock Mode when Twilio credentials are pending
  console.log(`\n------------------------------------------------------------`);
  console.log(`📱 [SIMULATED WHATSAPP NOTIFICATION VIA TWILIO]`);
  console.log(`👉 To: ${formattedTo}`);
  console.log(`📝 Message:\n"${messageText}"`);
  console.log(`ℹ️ Add TWILIO_ACCOUNT_SID & TWILIO_AUTH_TOKEN in .env for live carrier dispatch.`);
  console.log(`------------------------------------------------------------\n`);

  return {
    success: true,
    mode: 'SIMULATED (Add Twilio credentials in .env to go live)',
    sid: `SM_simulated_${Date.now()}`,
    recipient: formattedTo,
    message: messageText,
    sentAt: new Date()
  };
}
