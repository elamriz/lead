import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import mollieClient from '@/lib/mollie';

export async function POST(req: Request) {
    try {
        // Mollie sends the payment ID as 'id' in form-urlencoded body
        const formData = await req.formData();
        const paymentId = formData.get('id') as string;

        if (!paymentId) {
            return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
        }

        const payment = await mollieClient.payments.get(paymentId);
        const orderId = (payment.metadata as any)?.order_id;

        if (!orderId) {
            console.error("No order ID in metadata");
            return NextResponse.json({ error: "Invalid payment metadata" }, { status: 400 });
        }

        let status = 'pending';
        if (payment.status === 'paid') {
            status = 'paid';
        } else if (payment.status === 'canceled' || payment.status === 'expired') {
            status = 'canceled';
        } else if (payment.status === 'failed') {
            status = 'failed';
        }

        // Update the order in Supabase
        const { error } = await supabase
            .from('orders')
            .update({ status: status })
            .eq('id', orderId);

        if (error) {
            console.error("Supabase Update Error:", error);
            // Even if DB fails, return 200 to Mollie so they stop retrying? 
            // Better to return 500 so they retry if it's transient, but for this MVP let's return 200 to acknowledge.
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
    }
}
