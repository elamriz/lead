import { NextResponse } from 'next/server';
import mollieClient from '@/lib/mollie';

let cachedProfileId: string | null = null;

export async function GET() {
    // 1. Prefer Environment Variable (Best for stability)
    if (process.env.MOLLIE_PROFILE_ID) {
        return NextResponse.json({ profileId: process.env.MOLLIE_PROFILE_ID });
    }

    // 2. Return cached ID if available (from previous auto-detection)
    if (cachedProfileId) {
        return NextResponse.json({ profileId: cachedProfileId });
    }

    try {
        // Strategy: Create a temporary payment to extract the profileId from the response.
        // The 'profiles.getCurrent()' endpoint requires OAuth, but we have an API key.
        // Creating a payment with the API key returns the associated profileId.

        const payment = await mollieClient.payments.create({
            amount: {
                currency: 'EUR',
                value: '0.01',
            },
            description: 'Profile ID Detection',
            redirectUrl: 'https://example.com/redirect', // Dummy URL
        });

        if (payment.profileId) {
            cachedProfileId = payment.profileId;

            // We successfully got the ID. We disregard this payment (it stays open/expired).
            return NextResponse.json({ profileId: cachedProfileId });
        }

        return NextResponse.json({ error: "Could not retrieve profile ID from payment" }, { status: 500 });

    } catch (error: any) {
        console.error("Config Error - Failed to fetch profile ID:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
