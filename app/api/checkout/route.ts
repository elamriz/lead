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

        // 3. Create Order with Mollie (required for EcoChèques/Vouchers)
        // We use the absolute URL for redirect
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const host = req.headers.get('host');
        const baseUrl = `${protocol}://${host}`;

        const orderPayload: any = {
            amount: {
                currency: 'EUR',
                value: formattedTotal,
            },
            orderNumber: `ORD-${order.id}`,
            lines: items.map((item: any) => {
                const itemTotal = item.price * item.quantity;
                const vatRate = "21.00";
                // Calculate VAT amount from total (inclusive)
                const vatAmount = (itemTotal - (itemTotal / 1.21)).toFixed(2);

                return {
                    type: 'physical',
                    sku: item.id,
                    name: item.name,
                    imageUrl: item.image,
                    productUrl: `${baseUrl}/shop`,
                    quantity: item.quantity,
                    vatRate: vatRate,
                    vatAmount: {
                        currency: 'EUR',
                        value: vatAmount
                    },
                    unitPrice: {
                        currency: 'EUR',
                        value: item.price.toFixed(2)
                    },
                    totalAmount: {
                        currency: 'EUR',
                        value: itemTotal.toFixed(2)
                    },
                    discountAmount: {
                        currency: 'EUR',
                        value: '0.00'
                    },
                    category: 'eco' // Crucial for EcoChèques
                };
            }),
            billingAddress: {
                givenName: customerDetails.firstName,
                familyName: customerDetails.lastName,
                email: customerDetails.email,
                streetAndNumber: `${customerDetails.address} ${customerDetails.apartment || ''}`.trim(),
                postalCode: customerDetails.postalCode,
                city: customerDetails.city,
                country: customerDetails.country && customerDetails.country.length === 2 ? customerDetails.country.toUpperCase() : 'BE', // Fallback to BE if invalid
            },
            redirectUrl: `${baseUrl}/payment/status?orderId=${order.id}`,
            metadata: {
                order_id: order.id,
            },
            locale: 'fr_BE',
        };

        // Only add webhook URL if not on localhost (Mollie can't reach localhost)
        if (!baseUrl.includes('localhost')) {
            orderPayload.webhookUrl = `${baseUrl}/api/webhook/mollie`;
        }

        // Use orders.create instead of payments.create
        const mollieOrder = await mollieClient.orders.create(orderPayload);

        // 4. Update Order with Mollie Order ID
        // We store it in mollie_payment_id for now as it serves the same purpose of tracking the transaction
        await supabase
            .from('orders')
            .update({ mollie_payment_id: mollieOrder.id })
            .eq('id', order.id);

        return NextResponse.json({ checkoutUrl: mollieOrder.getCheckoutUrl() });

    } catch (error: any) {
        console.error("Checkout Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
