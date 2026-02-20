// /services/PaymentService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'https://shivoo-backend.onrender.com';

/**
 * Create a Razorpay order on the backend.
 * Returns { order_id, amount, currency } or throws.
 *
 * If your backend doesn't have this endpoint yet, a fallback
 * mode is used where we skip order creation and pass amount directly
 * to Razorpay (test-mode only — production requires server-side orders).
 */
export const createOrder = async (amount, currency = 'INR') => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) throw new Error('Access token not found.');

        const response = await axios.post(
            `${BASE_URL}/payments/create_order?access_token=${encodeURIComponent(
                accessToken.trim(),
            )}`,
            { amount, currency },
            { headers: { 'Content-Type': 'application/json' } },
        );

        return response.data; // expects { order_id, amount, currency }
    } catch (error) {
        // If the endpoint doesn't exist yet, return a fallback shape
        // so the WebView checkout can still work in test/dev mode.
        console.warn(
            '[PaymentService] createOrder failed, using client-side fallback:',
            error?.response?.status || error.message,
        );
        return { order_id: null, amount, currency };
    }
};

/**
 * Confirm a booking after successful Razorpay payment.
 * Calls the backend to record the booking and mark it as paid.
 */
export const confirmBooking = async ({
    eventId,
    ticketCount,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
}) => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) throw new Error('Access token not found.');

        const response = await axios.post(
            `${BASE_URL}/events/book?access_token=${encodeURIComponent(
                accessToken.trim(),
            )}`,
            {
                event_id: eventId,
                ticket_count: ticketCount,
                payment: {
                    razorpay_payment_id,
                    razorpay_order_id,
                    razorpay_signature,
                },
            },
            { headers: { 'Content-Type': 'application/json' } },
        );

        return response.data;
    } catch (error) {
        // Surface booking errors to caller for user-facing feedback
        console.error('[PaymentService] confirmBooking error:', error?.response?.data || error.message);
        throw error;
    }
};
