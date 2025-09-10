import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LeadData {
  isRestaurateur: boolean;
  isInCampania: boolean;
  restaurantZone: string;
  restaurantName: string;
  equipmentType: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  timestamp?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    
    // Check if it's a test email (no body) or lead notification
    if (!body || body === '{}') {
      console.log("Sending test email...");

      const emailResponse = await resend.emails.send({
        from: "Schettino Grandi Cucine <onboarding@resend.dev>",
        to: ["vincenzopetronebiz@gmail.com"],
        subject: "Email di prova",
        text: "email di prova",
      });

      console.log("Test email sent successfully:", emailResponse);

      return new Response(JSON.stringify({ success: true, data: emailResponse }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } else {
      // Parse lead data
      const leadData: LeadData = JSON.parse(body);
      console.log("Sending lead notification email...", leadData);

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nuovo Lead - Schettino Grandi Cucine</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; margin-top: 20px; margin-bottom: 20px;">
            
            <!-- Header with logo -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <img src="https://laxbglhrrcbrxpnpvcob.supabase.co/storage/v1/object/public/project-images/schettino-logo.png" alt="Schettino Grandi Cucine" style="height: 60px; margin-bottom: 15px;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🎉 NUOVO LEAD RICEVUTO!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Un nuovo cliente ha richiesto informazioni</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              
              <!-- Lead info -->
              <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #667eea;">
                <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; display: flex; align-items: center;">
                  👤 Informazioni Cliente
                </h2>
                <div style="display: grid; gap: 15px;">
                  <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #475569;">Nome:</strong>
                    <span style="color: #1e293b;">${leadData.firstName} ${leadData.lastName}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #475569;">📧 Email:</strong>
                    <span style="color: #1e293b;">${leadData.email}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                    <strong style="color: #475569;">📱 Telefono:</strong>
                    <span style="color: #1e293b; font-weight: 600;">${leadData.phoneNumber}</span>
                  </div>
                </div>
              </div>
              
              <!-- Restaurant info -->
              <div style="background: #f0f9ff; border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #0ea5e9;">
                <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; display: flex; align-items: center;">
                  🏪 Informazioni Ristorante
                </h2>
                <div style="display: grid; gap: 15px;">
                  <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0f2fe;">
                    <strong style="color: #475569;">Nome Ristorante:</strong>
                    <span style="color: #1e293b;">${leadData.restaurantName}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0f2fe;">
                    <strong style="color: #475569;">📍 Zona:</strong>
                    <span style="color: #1e293b;">${leadData.restaurantZone}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0f2fe;">
                    <strong style="color: #475569;">🔧 Attrezzatura:</strong>
                    <span style="color: #1e293b;">${leadData.equipmentType}</span>
                  </div>
                </div>
              </div>
              
              <!-- CTA -->
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; padding: 25px; text-align: center; color: white;">
                <h3 style="margin: 0 0 10px 0; font-size: 18px;">⏰ AZIONE RICHIESTA</h3>
                <p style="margin: 0 0 15px 0; font-size: 16px;">Chiamare il prima possibile per seguire questo lead!</p>
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">📅 Ricevuto il: ${leadData.timestamp || new Date().toLocaleString('it-IT')}</p>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                📧 Email automatica da Schettino Grandi Cucine
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `;

      const emailResponse = await resend.emails.send({
        from: "Schettino Grandi Cucine <onboarding@resend.dev>",
        to: ["vincenzopetronebiz@gmail.com", "jagermorris@gmail.com"],
        subject: "🎉 NUOVO LEAD - " + leadData.firstName + " " + leadData.lastName,
        html: emailHtml,
      });

      console.log("Lead notification email sent successfully:", emailResponse);

      return new Response(JSON.stringify({ success: true, data: emailResponse }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);