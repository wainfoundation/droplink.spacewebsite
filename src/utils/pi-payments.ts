
/**
 * Pi Network Payments Module - Following Official Documentation Exactly
 */
// Removed PiLogger import to prevent build issues
import { PiPaymentData, PaymentCallbacks, PiPayment } from './pi-types';
import { initPiNetwork } from './pi-utils';

// Create payment using Pi SDK according to official documentation
export const createPiPayment = async (
  paymentData: PiPaymentData,
  callbacks: PaymentCallbacks
): Promise<void> => {
  try {
    if (!window.Pi) {
      throw new Error("Pi SDK not initialized or not available");
    }

    // Ensure SDK is initialized
    initPiNetwork();

    // Create the payment object exactly as per official docs
    const piPaymentData = {
      amount: paymentData.amount,  /* Pi Amount being Transacted */
      memo: paymentData.memo, /* "Any information that you want to add to payment" */
      metadata: paymentData.metadata || {}, /* { Special Information: 1234, ... } */
    };

    // Callbacks the developer needs to implement - exactly as per docs
    const paymentCallbacks = {
      onReadyForServerApproval: function(paymentId: string) {
        console.log("onReadyForServerApproval", paymentId);
        console.log('payment_server_approval_ready', { paymentId });
        callbacks.onReadyForServerApproval(paymentId);
      },
      onReadyForServerCompletion: function(paymentId: string, txid: string) {
        console.log("onReadyForServerCompletion", paymentId, txid);
        console.log('payment_server_completion_ready', { paymentId, txid });
        callbacks.onReadyForServerCompletion(paymentId, txid);
      },
      onCancel: function(paymentId: string) {
        console.log("Payment cancelled:", paymentId);
        console.log('payment_cancelled', { paymentId });
        callbacks.onCancel(paymentId);
      },
      onError: function(error: Error, payment?: any) {
        console.error("Payment error:", error);
        console.error('payment_error', error, { 
          paymentId: payment?.identifier,
          amount: piPaymentData.amount 
        });
        callbacks.onError(error, payment);
      },
    };

    console.log('payment_create_start', piPaymentData);

    // Create payment exactly as per official documentation
    // Official docs: Pi.createPayment(paymentData: PaymentData, callbacks: PaymentCallbacks): void
    window.Pi.createPayment(piPaymentData, paymentCallbacks);
    
    console.log('payment_create_success', piPaymentData);
  } catch (error) {
    console.error('payment_create_error', error, { 
      amount: paymentData.amount,
      memo: paymentData.memo 
    });
    throw error;
  }
};
