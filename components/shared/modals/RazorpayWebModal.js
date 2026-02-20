// /components/shared/modals/RazorpayWebModal.js
/**
 * WebView-based Razorpay checkout — works in Expo Go and any EAS build
 * without native module linking.
 *
 * Props:
 *   isVisible      {boolean}  - controls modal visibility
 *   amount         {number}   - amount in INR (NOT paise — we convert internally)
 *   orderId        {string|null} - Razorpay order_id from backend (nullable for test mode)
 *   razorpayKey    {string}   - your Razorpay Key ID
 *   prefill        {object}   - { name, email, contact } from logged-in user
 *   description    {string}   - shown inside Razorpay checkout (e.g. event title)
 *   onSuccess      {function} - ({ razorpay_payment_id, razorpay_order_id, razorpay_signature })
 *   onDismiss      {function} - called when user cancels / closes checkout
 *   onError        {function} - (description: string) called on payment failure
 */
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import {
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { darkColors, lightColors } from '../../../themes/basics';

const RAZORPAY_CHECKOUT_HTML = ({
    key,
    orderId,
    amount,
    name,
    description,
    prefill,
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment</title>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f0f4ff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .loader {
      text-align: center;
      color: #555;
    }
    .loader p {
      margin-top: 12px;
      font-size: 15px;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #ddd;
      border-top-color: #3399cc;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="loader">
    <div class="spinner"></div>
    <p>Opening checkout…</p>
  </div>
  <script>
    function openRazorpay() {
      var options = {
        key: "${key}",
        amount: "${amount * 100}",
        currency: "INR",
        name: "${name}",
        description: "${description.replace(/"/g, '\\"')}",
        ${orderId ? `order_id: "${orderId}",` : ''}
        prefill: {
          name:    "${(prefill?.name || '').replace(/"/g, '\\"')}",
          email:   "${(prefill?.email || '').replace(/"/g, '\\"')}",
          contact: "${(prefill?.contact || '').replace(/"/g, '\\"')}"
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "razorpay_dismiss" }));
          }
        },
        handler: function(response) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "razorpay_success",
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id:   response.razorpay_order_id   || null,
            razorpay_signature:  response.razorpay_signature  || null
          }));
        }
      };

      try {
        var rzp = new Razorpay(options);
        rzp.on("payment.failed", function(response) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "razorpay_error",
            description: response.error.description || "Payment failed"
          }));
        });
        rzp.open();
      } catch(e) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "razorpay_error",
          description: e.message || "Could not initialise checkout"
        }));
      }
    }

    // Wait for DOM + script to be ready
    window.onload = openRazorpay;
  </script>
</body>
</html>
`;

const RazorpayWebModal = ({
    isVisible,
    amount,
    orderId,
    razorpayKey,
    prefill,
    description = 'Event Booking',
    onSuccess,
    onDismiss,
    onError,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const bg = isDark ? darkColors.backgroundColor : lightColors.backgroundColor;
    const textColor = isDark ? darkColors.textColor : lightColors.textColor;

    const htmlContent = RAZORPAY_CHECKOUT_HTML({
        key: razorpayKey,
        orderId,
        amount,
        name: 'Techitzy',
        description,
        prefill,
    });

    const handleMessage = useCallback(
        event => {
            try {
                const data = JSON.parse(event.nativeEvent.data);
                if (data.type === 'razorpay_success') {
                    onSuccess?.({
                        razorpay_payment_id: data.razorpay_payment_id,
                        razorpay_order_id: data.razorpay_order_id,
                        razorpay_signature: data.razorpay_signature,
                    });
                } else if (data.type === 'razorpay_dismiss') {
                    onDismiss?.();
                } else if (data.type === 'razorpay_error') {
                    onError?.(data.description);
                }
            } catch (e) {
                console.error('[RazorpayWebModal] message parse error', e);
            }
        },
        [onSuccess, onDismiss, onError],
    );

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onDismiss}>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
                {/* Header bar with close button */}
                <View style={[styles.header, { backgroundColor: bg }]}>
                    <Text style={[styles.headerTitle, { color: textColor }]}>
                        Secure Payment
                    </Text>
                    <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="close" size={26} color={textColor} />
                    </TouchableOpacity>
                </View>

                {/* Razorpay WebView */}
                <WebView
                    source={{ html: htmlContent }}
                    style={styles.webView}
                    javaScriptEnabled
                    domStorageEnabled
                    originWhitelist={['*']}
                    onMessage={handleMessage}
                    // Allow Razorpay to redirect for UPI/netbanking flows
                    setSupportMultipleWindows={false}
                />
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    webView: {
        flex: 1,
    },
});

export default RazorpayWebModal;
