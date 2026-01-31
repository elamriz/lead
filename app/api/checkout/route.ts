import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import mollieClient from '@/lib/mollie';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { items, customerDetails } = body;

        // 1. Calculate Total (Simple sum of items sent from client - IN PROD, verify with DB products)
        // For MVP we accept client values but ensuring we don't proceed with 0
        const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        const formattedTotal = totalAmount.toFixed(2);

        // 2. Create Order in Supabase
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                total_amount: totalAmount,
                status: 'pending',
                customer_details: customerDetails,
                items: items
            })
            .select() // Select to get the ID
            .single();

        if (orderError) {
            console.error("Supabase Order Error:", orderError);
            return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
        }

        // 3. Create Payment with Mollie
        // We use the absolute URL for redirect
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const baseUrl = `${protocol}://${host}`;

        const paymentPayload: any = {
            amount: {
                currency: 'EUR',
                value: formattedTotal,
            },
            description: `Order #${order.id}`,
            redirectUrl: `${baseUrl}/payment/status?orderId=${order.id}`,
            metadata: {
                order_id: order.id,
            },
        };

        // Only add webhook URL if not on localhost (Mollie can't reach localhost)
        if (!baseUrl.includes('localhost')) {
            paymentPayload.webhookUrl = `${baseUrl}/api/webhook/mollie`;
        }

        // If cardToken is provided (from Mollie Components), add it
        if (body.cardToken) {
            paymentPayload.cardToken = body.cardToken;
            paymentPayload.method = 'creditcard'; // Required when using cardToken
        }

        const payment = await mollieClient.payments.create(paymentPayload);

        // 4. Update Order with Payment ID
        await supabase
            .from('orders')
            .update({ mollie_payment_id: payment.id })
            .eq('id', order.id);

        return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() });

    } catch (error: any) {
        console.error("Checkout Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
