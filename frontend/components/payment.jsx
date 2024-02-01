import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.log('[Error]', error);
            setLoading(false);
        } else {
            const paymentResponse = await axios.post('http://localhost:3000/payment/charge', {
                amount: 1000, // e.g., $10.00
                currency: 'usd',
                source: paymentMethod.id,
                description: 'Test charge',
            });

            console.log('Payment response', paymentResponse);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe || loading}>
                Pay
            </button>
        </form>
    );
};

export default PaymentForm;
