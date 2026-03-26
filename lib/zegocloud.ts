import { randomBytes, createHmac } from 'crypto';

export function generateZegoToken(userId: string): string {
  const appId = Number(process.env.ZEGOCLOUD_APP_ID!);
  const serverSecret = process.env.ZEGOCLOUD_SERVER_SECRET || 'dummy_secret';
  
  const timestamp = Math.floor(Date.now() / 1000);
  const expire = timestamp + 3600; // 1 hour
  const nonce = randomBytes(8).toString('hex');

  const content = `${appId}${userId}${nonce}${expire}`;
  const signature = createHmac('sha256', serverSecret)
    .update(content)
    .digest('hex');

  const payload = JSON.stringify({
    app_id: appId,
    user_id: userId,
    nonce,
    ctime: timestamp,
    expire,
    signature,
  });

  return Buffer.from(payload).toString('base64');
}
