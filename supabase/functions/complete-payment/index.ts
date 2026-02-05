
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Pi API endpoints - sandbox mode
const PI_API_URL = "https://api.testnet.minepi.com";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  }

  try {
    const { paymentId, txid, apiKey } = await req.json()

    if (!paymentId || !txid || !apiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    // Complete the payment using Pi API
    const response = await fetch(`${PI_API_URL}/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ txid }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Pi API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()

    return new Response(
      JSON.stringify({ success: true, payment: result }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )

  } catch (error) {
    console.error('Error completing payment:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  }
})
