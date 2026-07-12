import { getOrderById } from "./orders";
import { Resend } from "resend";
import twilio from "twilio";

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}
// Helper function to get Twilio client safely
function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  
  if (!sid || !sid.startsWith("AC") || !token) {
    return null;
  }
  
  return twilio(sid, token);
}

export async function sendPreviewNotifications(orderId: string) {
  const order = await getOrderById(orderId);
  
  if (!order) {
    console.error(`[Notifications] Commande ${orderId} introuvable.`);
    return;
  }

  const previewLink = `http://localhost:3000/preview?orderId=${orderId}`;

  // 1. ENVOI E-MAIL AVEC RESEND
  if (order.answers.email && process.env.RESEND_API_KEY) {
    console.log(`[E-Mail] Envoi de l'e-mail à ${order.answers.email}...`);
    try {
      await getResendClient()?.emails.send({
        from: "Mosiqti <contact@mosiqti.com>", // À remplacer par votre domaine vérifié sur Resend
        to: order.answers.email,
        subject: "Votre chanson personnalisée est presque prête ! 🎵",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Mosiqti</h2>
            <p>Bonjour,</p>
            <p>Nous avons composé un extrait de 30 secondes de la chanson pour <strong>${order.answers.recipientName}</strong> !</p>
            <p>Écoutez cet extrait gratuit exclusif (écoutable une seule fois) :</p>
            <a href="${previewLink}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Écouter ma preview</a>
            <p style="margin-top: 30px; font-size: 12px; color: #666;">Si vous ne parvenez pas à cliquer sur le bouton, copiez ce lien : <br> ${previewLink}</p>
          </div>
        `,
      });
      console.log(`[E-Mail] E-mail envoyé avec succès.`);
    } catch (error) {
      console.error(`[E-Mail] Erreur lors de l'envoi :`, error);
    }
  }

  // 2. ENVOI WHATSAPP AVEC TWILIO
  if (
    order.answers.phoneNumber &&
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_NUMBER
  ) {
    const rawPhone = order.answers.phoneNumber.replace(/^0+/, ""); // Enlever le 0 au début si présent
    const formattedPhone = `whatsapp:${order.answers.phoneCountryCode}${rawPhone}`;
    
    console.log(`[WhatsApp] Envoi du message WhatsApp au ${formattedPhone}...`);
    try {
      const twilioClient = getTwilioClient();
      if (twilioClient) {
        await twilioClient.messages.create({
          from: process.env.TWILIO_WHATSAPP_NUMBER,
          to: formattedPhone,
          body: `🎵 *Mosiqti* - Bonjour ! \n\nVotre chanson sur-mesure pour ${order.answers.recipientName} est presque prête.\n\nÉcoutez votre extrait gratuit de 30 secondes en cliquant ici (valable 1 fois) : \n${previewLink}`,
        });
        console.log(`[WhatsApp] Message envoyé avec succès.`);
      } else {
        console.log(`[WhatsApp] Client Twilio non configuré (identifiants invalides ou manquants).`);
      }
    } catch (error) {
      console.error(`[WhatsApp] Erreur lors de l'envoi :`, error);
    }
  }

  console.log(`[Notifications] Processus terminé pour la commande ${orderId}.`);
}

export async function sendPaymentConfirmationNotification(orderId: string) {
  const order = await getOrderById(orderId);
  
  if (!order) {
    console.error(`[Notifications] Commande ${orderId} introuvable pour la confirmation.`);
    return;
  }

  // 1. ENVOI E-MAIL DE CONFIRMATION AVEC RESEND
  if (order.answers.email && process.env.RESEND_API_KEY) {
    console.log(`[E-Mail] Envoi de la confirmation de paiement à ${order.answers.email}...`);
    try {
      await getResendClient()?.emails.send({
        from: "Mosiqti <contact@mosiqti.com>", // À remplacer par votre domaine vérifié sur Resend
        to: order.answers.email,
        subject: "Confirmation de votre commande Mosiqti 🎵",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Mosiqti</h2>
            <p>Bonjour,</p>
            <p>Nous vous confirmons la bonne réception de votre paiement pour la chanson de <strong>${order.answers.recipientName}</strong> !</p>
            <p>Notre équipe travaille actuellement sur votre commande. Vous serez notifié(e) très prochainement pour écouter un premier extrait.</p>
            <p>Merci de votre confiance et à très vite !</p>
            <p style="margin-top: 30px; font-size: 12px; color: #666;">L'équipe Mosiqti</p>
          </div>
        `,
      });
      console.log(`[E-Mail] E-mail de confirmation envoyé avec succès.`);
    } catch (error) {
      console.error(`[E-Mail] Erreur lors de l'envoi de la confirmation :`, error);
    }
  }
}
