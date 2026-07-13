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
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF7F2; padding: 0;">
            <div style="text-align: center; padding: 30px 20px;">
              <h1 style="color: #000; font-size: 28px; margin: 0; font-weight: bold;">Mosiqti</h1>
            </div>
            <div style="padding: 0 40px 40px 40px; color: #000; line-height: 1.6; font-size: 16px;">
              <p>Bonjour,</p>
              <p style="font-size: 18px;"><strong>L'extrait de la chanson pour ${order.answers.recipientName} est prêt 🎵</strong></p>
              <p>Vous avez pris le temps de nous partager votre histoire, alors nous avons préparé quelque chose de spécial : <strong>Nous avons créé un court extrait de votre chanson sur-mesure.</strong></p>
              <p>Cliquez ci-dessous pour l'écouter. Si vous l'adorez, vous pourrez débloquer la version complète juste après.</p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${previewLink}" style="display: inline-block; background-color: #FF7043; color: white; padding: 16px 32px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 18px;">Écouter mon extrait ici</a>
              </div>

              <p>Cette chanson a été créée à partir des détails que vous avez partagés, elle est donc déjà façonnée autour de votre histoire, de votre moment et de la personne à qui elle est destinée.</p>
              
              <p>Pourquoi nos clients adorent :</p>
              <ul style="margin-bottom: 30px;">
                <li style="margin-bottom: 10px;">c'est personnel dès les premières secondes</li>
                <li style="margin-bottom: 10px;">ça transforme un souvenir en quelque chose que vous pouvez garder pour toujours</li>
                <li style="margin-bottom: 10px;">ça fait un cadeau inoubliable</li>
              </ul>

              <p>Si cet extrait vous donne des frissons, la chanson complète n'attend plus que vous.</p>

              <p style="margin-top: 40px;">L'équipe<br>Mosiqti</p>

              <p style="font-size: 14px; color: #555;">P.S. Votre extrait est lié à cet e-mail, vous pouvez donc l'écouter en un seul clic.</p>
            </div>
            
            <div style="background-color: #312E3D; color: white; text-align: center; padding: 30px 20px; font-size: 12px;">
              <p style="margin: 0;">© ${new Date().getFullYear()} Mosiqti. Tous droits réservés.</p>
            </div>
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
      const resendClient = getResendClient();
      if (!resendClient) return;
      
      const { data, error } = await resendClient.emails.send({
        from: "Mosiqti <contact@mosiqti.com>",
        to: order.answers.email,
        subject: "Confirmation de votre commande Mosiqti 🎵",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF7F2; padding: 0;">
            <div style="text-align: center; padding: 30px 20px;">
              <h1 style="color: #000; font-size: 28px; margin: 0; font-weight: bold;">Mosiqti</h1>
            </div>
            <div style="padding: 0 40px 40px 40px; color: #000; line-height: 1.6; font-size: 16px;">
              <p>Bonjour,</p>
              <p style="font-size: 18px;"><strong>Nous vous confirmons la bonne réception de votre paiement pour la chanson de ${order.answers.recipientName} ! 🎵</strong></p>
              <p>Notre équipe travaille actuellement sur votre commande. Vous serez notifié(e) très prochainement pour écouter un premier extrait.</p>
              <p>Merci de votre confiance et à très vite !</p>
              <p style="margin-top: 40px;">L'équipe<br>Mosiqti</p>
            </div>
            <div style="background-color: #312E3D; color: white; text-align: center; padding: 30px 20px; font-size: 12px;">
              <p style="margin: 0;">© ${new Date().getFullYear()} Mosiqti. Tous droits réservés.</p>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error(`[E-Mail] Erreur API Resend :`, error);
      } else {
        console.log(`[E-Mail] E-mail de confirmation envoyé avec succès. ID:`, data?.id);
      }
    } catch (error) {
      console.error(`[E-Mail] Exception lors de l'envoi de la confirmation :`, error);
    }
  }
}

export async function sendAbandonedCartNotification(orderId: string, stage: number) {
  const order = await getOrderById(orderId);
  
  if (!order) {
    console.error(`[Notifications] Commande ${orderId} introuvable pour la relance.`);
    return;
  }

  const checkoutUrl = `https://mosiqti.com/checkout?orderId=${orderId}`;

  let subject = "";
  let p1 = "";
  let p2 = "";
  let waText = "";

  switch (stage) {
    case 1:
      subject = "🎵 N'oubliez pas votre chanson sur-mesure !";
      p1 = `Vous avez commencé à créer une chanson personnalisée pour <strong>${order.answers.recipientName || "votre proche"}</strong>, mais vous n'avez pas encore finalisé votre commande.`;
      p2 = "Toutes vos informations sont sauvegardées ! Il ne vous reste plus qu'une étape pour que nos artistes se mettent au travail.";
      waText = `Vous avez commencé à créer une chanson pour ${order.answers.recipientName || "votre proche"}, mais vous n'avez pas encore finalisé votre commande.\n\nToutes vos informations sont sauvegardées ! Finalisez votre commande ici : \n${checkoutUrl}`;
      break;
    case 2:
      subject = "⏳ Votre brouillon vous attend toujours...";
      p1 = `Nous avons conservé précieusement les informations pour la chanson de <strong>${order.answers.recipientName || "votre proche"}</strong>.`;
      p2 = "Ne laissez pas cette belle idée de côté ! Finalisez votre commande en un clic.";
      waText = `Petit rappel ⏳ : Les informations pour la chanson de ${order.answers.recipientName || "votre proche"} vous attendent toujours ! Finalisez votre commande ici : \n${checkoutUrl}`;
      break;
    case 7:
      subject = "⚠️ Toujours intéressé(e) par votre chanson ?";
      p1 = `Cela fait une semaine que vous avez commencé à préparer une belle surprise pour <strong>${order.answers.recipientName || "votre proche"}</strong>.`;
      p2 = "Êtes-vous toujours intéressé(e) ? Nos artistes sont prêts à enregistrer votre chanson.";
      waText = `Cela fait 7 jours que vous avez commencé une chanson pour ${order.answers.recipientName || "votre proche"} ⚠️. Êtes-vous toujours intéressé(e) ? \n\nFinalisez-la ici avant qu'elle n'expire : \n${checkoutUrl}`;
      break;
    case 30:
      subject = "🗑️ Dernier rappel : votre brouillon va expirer";
      p1 = `Ceci est notre dernier rappel concernant la chanson pour <strong>${order.answers.recipientName || "votre proche"}</strong>.`;
      p2 = "Si vous ne finalisez pas votre commande aujourd'hui, votre brouillon sera supprimé de nos serveurs demain.";
      waText = `Ceci est notre dernier rappel 🗑️. Si vous ne finalisez pas la chanson pour ${order.answers.recipientName || "votre proche"} aujourd'hui, les informations seront supprimées demain.\n\nDernière chance : \n${checkoutUrl}`;
      break;
    default:
      subject = "🎵 N'oubliez pas votre chanson sur-mesure !";
      p1 = `Vous n'avez pas encore finalisé votre commande pour <strong>${order.answers.recipientName || "votre proche"}</strong>.`;
      p2 = "Finalisez-la dès maintenant !";
      waText = `Vous n'avez pas encore finalisé la chanson pour ${order.answers.recipientName || "votre proche"}. Finalisez-la ici : \n${checkoutUrl}`;
  }

  // 1. ENVOI E-MAIL AVEC RESEND
  if (order.answers.email && process.env.RESEND_API_KEY) {
    console.log(`[E-Mail] Envoi de la relance (Palier ${stage}) à ${order.answers.email}...`);
    try {
      await getResendClient()?.emails.send({
        from: "Mosiqti <contact@mosiqti.com>", // À remplacer par votre domaine vérifié sur Resend
        to: order.answers.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF7F2; padding: 0;">
            <div style="text-align: center; padding: 30px 20px;">
              <h1 style="color: #000; font-size: 28px; margin: 0; font-weight: bold;">Mosiqti</h1>
            </div>
            <div style="padding: 0 40px 40px 40px; color: #000; line-height: 1.6; font-size: 16px;">
              <p>Bonjour,</p>
              <p style="font-size: 18px;"><strong>${subject}</strong></p>
              <p>${p1}</p>
              <p>${p2}</p>
              <div style="text-align: center; margin: 40px 0;">
                <a href="${checkoutUrl}" style="display: inline-block; background-color: #FF7043; color: white; padding: 16px 32px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 18px;">Finaliser ma commande</a>
              </div>
              <p style="margin-top: 40px;">L'équipe<br>Mosiqti</p>
              <p style="font-size: 14px; color: #555;">Si le bouton ne fonctionne pas, copiez ce lien : <br> ${checkoutUrl}</p>
            </div>
            <div style="background-color: #312E3D; color: white; text-align: center; padding: 30px 20px; font-size: 12px;">
              <p style="margin: 0;">© ${new Date().getFullYear()} Mosiqti. Tous droits réservés.</p>
            </div>
          </div>
        `,
      });
      console.log(`[E-Mail] E-mail de relance (Palier ${stage}) envoyé avec succès.`);
    } catch (error) {
      console.error(`[E-Mail] Erreur lors de l'envoi de la relance :`, error);
    }
  }

  // 2. ENVOI WHATSAPP AVEC TWILIO
  if (
    order.answers.phoneNumber &&
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_NUMBER
  ) {
    const rawPhone = order.answers.phoneNumber.replace(/^0+/, "");
    const formattedPhone = `whatsapp:${order.answers.phoneCountryCode}${rawPhone}`;
    
    console.log(`[WhatsApp] Envoi de la relance WhatsApp (Palier ${stage}) au ${formattedPhone}...`);
    try {
      const twilioClient = getTwilioClient();
      if (twilioClient) {
        await twilioClient.messages.create({
          from: process.env.TWILIO_WHATSAPP_NUMBER,
          to: formattedPhone,
          body: `🎵 *Mosiqti* - Bonjour ! \n\n${waText}`,
        });
        console.log(`[WhatsApp] Relance WhatsApp (Palier ${stage}) envoyée avec succès.`);
      } else {
        console.log(`[WhatsApp] Client Twilio non configuré.`);
      }
    } catch (error) {
      console.error(`[WhatsApp] Erreur lors de l'envoi de la relance :`, error);
    }
  }
}
