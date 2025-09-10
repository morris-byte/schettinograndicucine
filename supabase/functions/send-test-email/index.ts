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

      const emailText = `NUOVO LEAD RICEVUTO

Nome: ${leadData.firstName} ${leadData.lastName}
Email: ${leadData.email}
Telefono: ${leadData.phoneNumber}

Ristorante: ${leadData.restaurantName}
Zona: ${leadData.restaurantZone}
Attrezzatura richiesta: ${leadData.equipmentType}

Data: ${leadData.timestamp || new Date().toLocaleString('it-IT')}

Chiamare il prima possibile per seguire questo lead.`;

      const emailResponse = await resend.emails.send({
        from: "Schettino Grandi Cucine <onboarding@resend.dev>",
        to: ["vincenzopetronebiz@gmail.com"],
        subject: "NUOVO LEAD - " + leadData.firstName + " " + leadData.lastName,
        text: emailText,
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