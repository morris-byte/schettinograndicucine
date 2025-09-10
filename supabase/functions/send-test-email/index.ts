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
        to: [
          "commerciale@schettinograndicucine.it",
          "segreteria@schettinograndicucine.it", 
          "andrea@schettinograndicucine.it",
          "jagermorris@gmail.com",
          "vincenzopetronebiz@gmail.com",
          "vincenzopetrone3000@gmail.com"
        ],
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
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; min-height: 100vh;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; margin-top: 20px; margin-bottom: 20px;">
            
            <!-- Header -->
            <div style="background-color: #16a34a; padding: 40px 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.025em;">Nuovo Lead Ricevuto</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Un cliente ha richiesto informazioni</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 32px 24px;">
              
              <!-- Lead info -->
              <div style="margin-bottom: 24px;">
                <h2 style="color: #111827; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Informazioni Cliente</h2>
                <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                  <div style="margin-bottom: 12px;">
                    <span style="color: #6b7280; font-weight: 500; display: inline-block; width: 80px;">Nome:</span>
                    <span style="color: #111827; font-weight: 600;">${leadData.firstName} ${leadData.lastName}</span>
                  </div>
                  <div style="margin-bottom: 12px;">
                    <span style="color: #6b7280; font-weight: 500; display: inline-block; width: 80px;">Email:</span>
                    <span style="color: #111827;">${leadData.email}</span>
                  </div>
                  <div style="margin-bottom: 0;">
                    <span style="color: #6b7280; font-weight: 500; display: inline-block; width: 80px;">Telefono:</span>
                    <span style="color: #111827; font-weight: 600;">${leadData.phoneNumber}</span>
                  </div>
                </div>
              </div>
              
              <!-- Restaurant info -->
              <div style="margin-bottom: 24px;">
                <h2 style="color: #111827; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Informazioni Ristorante</h2>
                <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
                  <div style="margin-bottom: 12px;">
                    <span style="color: #6b7280; font-weight: 500; display: inline-block; width: 120px;">Ristorante:</span>
                    <span style="color: #111827; font-weight: 600;">${leadData.restaurantName}</span>
                  </div>
                  <div style="margin-bottom: 12px;">
                    <span style="color: #6b7280; font-weight: 500; display: inline-block; width: 120px;">Zona:</span>
                    <span style="color: #111827;">${leadData.restaurantZone}</span>
                  </div>
                  <div style="margin-bottom: 0;">
                    <span style="color: #6b7280; font-weight: 500; display: inline-block; width: 120px;">Attrezzatura:</span>
                    <span style="color: #111827;">${leadData.equipmentType}</span>
                  </div>
                </div>
              </div>
              
              <!-- Call to action -->
              <div style="background-color: #16a34a; border-radius: 8px; padding: 20px; text-align: center;">
                <p style="color: white; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Chiamare il prima possibile!</p>
                <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">Ricevuto il: ${leadData.timestamp || new Date().toLocaleString('it-IT')}</p>
              </div>
              
            </div>
            
            <!-- Footer -->
            <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Email automatica da Schettino Grandi Cucine
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `;

      const emailResponse = await resend.emails.send({
        from: "Schettino Grandi Cucine <onboarding@resend.dev>",
        to: [
          "commerciale@schettinograndicucine.it",
          "segreteria@schettinograndicucine.it", 
          "andrea@schettinograndicucine.it",
          "jagermorris@gmail.com",
          "vincenzopetronebiz@gmail.com",
          "vincenzopetrone3000@gmail.com"
        ],
        subject: "Nuovo Lead - " + leadData.firstName + " " + leadData.lastName,
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