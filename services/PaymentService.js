// /services/PaymentService.js
// WebView-based Razorpay — no native SDK, works in Expo Go.
// Replace stub bodies with real axios calls once the backend is ready.

const DUMMY_ORDER_ID = 'order_DummyRazorpay1234';
const DUMMY_PAYMENT_ID = 'pay_DummyRazorpay5678';
const DUMMY_SIGNATURE = 'dummysig_hmac_sha256_abcdef1234567890';

/**
 * Create a Razorpay order.
 * Real flow → POST /payments/create_order → { order_id, amount, currency }
 * Stub  → returns null order_id so the WebView checkout skips the order step.
 */
export const createOrder = async (amount, currency = 'INR') => {
    // TODO: uncomment once backend is ready
    // const accessToken = await AsyncStorage.getItem('accessToken');
    // const response = await axios.post(`${BASE_URL}/payments/create_order?access_token=...`,
    //     { amount, currency }, { headers: { 'Content-Type': 'application/json' } });
    // return response.data; // { order_id, amount, currency }

    console.log('[PaymentService] createOrder (stub) →', { amount, currency });
    return { order_id: null, amount, currency };
};

/**
 * Confirm a booking after successful Razorpay payment.
 * Real flow → POST /events/book → { booking_id, status, ... }
 * Stub  → returns a client-side confirmation.
 */
export const confirmBooking = async ({
    eventId,
    ticketCount,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
}) => {
    // TODO: uncomment once backend is ready
    // const accessToken = await AsyncStorage.getItem('accessToken');
    // const response = await axios.post(`${BASE_URL}/events/book?access_token=...`, {
    //     event_id: eventId,
    //     ticket_count: ticketCount,
    //     payment: { razorpay_payment_id, razorpay_order_id, razorpay_signature },
    // });
    // return response.data;

    console.log('[PaymentService] confirmBooking (stub) →', { eventId, ticketCount, razorpay_payment_id });
    return {
        booking_id: `BOOK-${Date.now()}`,
        status: 'confirmed',
        event_id: eventId,
        ticket_count: ticketCount,
        payment: { razorpay_payment_id, razorpay_order_id, razorpay_signature },
    };
};
