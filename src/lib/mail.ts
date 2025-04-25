interface EmailOptions {
  buyerEmail: string;
  farmerEmail: string;
  cropName: string;
  quantity: number;
  totalPrice: number;
}

export async function sendOrderConfirmationEmail({
  buyerEmail,
  farmerEmail,
  cropName,
  quantity,
  totalPrice,
}: EmailOptions) {
  // In a real app, implement with Nodemailer, SendGrid, etc.
  console.log(`Order confirmation sent to buyer: ${buyerEmail}`);
  console.log(`Order notification sent to farmer: ${farmerEmail}`);
  console.log(`Order details: ${quantity} x ${cropName} = $${totalPrice}`);
  return true;
}
