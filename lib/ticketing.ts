import crypto from 'crypto';

export type CheckoutItem = { tierId: string; quantity: number };

export function normalisePhone(input: string) {
  const compact = input.trim().replace(/[\s().-]/g, '');
  const digits = compact.replace(/^\+/, '');
  if (!/^\d{8,15}$/.test(digits)) throw new Error('Enter a valid WhatsApp number with country code.');
  return `+${digits}`;
}

export function makeOrderReference() {
  return `SMB-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

export function calculateOrder(items: CheckoutItem[], tiers: { id: string; name: string; price: number; quantity: number; sold: number; perOrderLimit: number | null }[], defaultLimit: number) {
  if (!items.length) throw new Error('Choose at least one ticket.');
  let quantity = 0;
  const priced = items.map(item => {
    const tier = tiers.find(candidate => candidate.id === item.tierId);
    if (!tier || !Number.isInteger(item.quantity) || item.quantity < 1) throw new Error('One of the selected ticket types is invalid.');
    if (item.quantity > (tier.perOrderLimit ?? defaultLimit)) throw new Error(`The limit for this ticket is ${tier.perOrderLimit ?? defaultLimit}.`);
    if (tier.quantity - tier.sold < item.quantity) throw new Error(`${tier.id} does not have enough tickets remaining.`);
    quantity += item.quantity;
    return { tier, quantity: item.quantity, subtotal: tier.price * item.quantity };
  });
  if (quantity > defaultLimit) throw new Error(`A maximum of ${defaultLimit} tickets can be purchased per order.`);
  return { priced, quantity, amount: priced.reduce((sum, item) => sum + item.subtotal, 0) };
}
