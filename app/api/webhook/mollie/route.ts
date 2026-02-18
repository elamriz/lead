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

        if (paymentId.startsWith('ord_')) {
            const order = await mollieClient.orders.get(paymentId);
            const supabaseOrderId = (order.metadata as any)?.order_id;

            if (!supabaseOrderId) {
                return NextResponse.json({ error: "Invalid order metadata" }, { status: 400 });
            }

            let status = 'pending';
            if (order.status === 'paid' || order.status === 'authorized' || order.status === 'completed' || order.status === 'shipping') {
                status = 'paid';
            } else if (order.status === 'canceled' || order.status === 'expired') {
                status = 'canceled';
            }

            await supabase
                .from('orders')
                .update({ status: status })
                .eq('id', supabaseOrderId);

            return NextResponse.json({ received: true });
        } else {
            const payment = await mollieClient.payments.get(paymentId);
            const orderId = (payment.metadata as any)?.order_id;

            if (!orderId) {
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

            await supabase
                .from('orders')
                .update({ status: status })
                .eq('id', orderId);

            return NextResponse.json({ received: true });
        }

    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
    }
}
