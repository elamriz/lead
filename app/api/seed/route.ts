import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { products } from '@/lib/data';

export async function GET() {
    // Create an admin client to bypass RLS if the service role key is available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // 1. Use upsert to update existing products or insert new ones
        const mappedProducts = products.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            original_price: p.originalPrice,
            image: p.image,
            description: p.description,
            specs: p.specs,
            is_new: p.isNew
        }));

        const { error: insertError } = await supabase
            .from('products')
            .upsert(mappedProducts, { onConflict: 'id' });

        if (insertError) {
            console.error("Seed Insert Error:", insertError);
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Database seeded successfully with ${products.length} products.`
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
