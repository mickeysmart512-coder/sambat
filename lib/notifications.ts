export type TicketNotification = { reference: string; buyerName: string; phone: string; email: string; show: string; items: string; amount: number; currency: string; timestamp: Date };
export interface NotificationChannel { send(notification: TicketNotification): Promise<void> }

export class DiscordWebhookChannel implements NotificationChannel {
  async send(notification: TicketNotification) {
    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (!webhook) throw new Error('DISCORD_WEBHOOK_URL is not configured');
    const phone = notification.phone.replace(/\D/g, '');
    const content = `**Paid ticket order ${notification.reference}**\nBuyer: ${notification.buyerName}\nWhatsApp: [${notification.phone}](https://wa.me/${phone})\nEmail: ${notification.email}\nShow: ${notification.show}\nTickets: ${notification.items}\nAmount: ${notification.currency} ${notification.amount.toLocaleString()}\nTime: ${notification.timestamp.toISOString()}`;
    const response = await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) });
    if (!response.ok) throw new Error(`Discord webhook failed (${response.status})`);
  }
}

export class WhatsAppCloudChannel implements NotificationChannel {
  async send(_notification: TicketNotification) {
    if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) throw new Error('WhatsApp Cloud API is not configured');
    throw new Error('WhatsApp adapter requires an approved template before it can send notifications.');
  }
}

export function notificationChannel(): NotificationChannel {
  return process.env.NOTIFY_CHANNEL === 'whatsapp' ? new WhatsAppCloudChannel() : new DiscordWebhookChannel();
}
