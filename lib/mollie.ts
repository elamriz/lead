import { createMollieClient } from '@mollie/api-client';

const mollieClient = createMollieClient({
    apiKey: (process.env.MOLLIE_LIVE_API_KEY || process.env.MOLLIE_API_KEY) as string,
});

export default mollieClient;
