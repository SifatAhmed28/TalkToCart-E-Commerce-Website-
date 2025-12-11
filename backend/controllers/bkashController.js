import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const globals = {}; // Store tokens temporarily (In production, use Redis)

const getHeaders = async () => {
    // 1. Get Token if not exists
    if (!globals.id_token) {
        const { data } = await axios.post(`${process.env.BKASH_BASE_URL}/tokenized/checkout/token/grant`, {
            app_key: process.env.BKASH_APP_KEY,
            app_secret: process.env.BKASH_APP_SECRET,
        }, {
            headers: {
                username: process.env.BKASH_USERNAME,
                password: process.env.BKASH_PASSWORD,
                "Content-Type": "application/json"
            }
        });
        globals.id_token = data.id_token;
    }
    return {
        Authorization: globals.id_token,
        "X-APP-Key": process.env.BKASH_APP_KEY,
        "Content-Type": "application/json"
    };
};

export const payWithBkash = async (req, res) => {
    try {
        const { amount, orderId } = req.body;
        const headers = await getHeaders();

        // 2. Create Payment
        const { data } = await axios.post(`${process.env.BKASH_BASE_URL}/tokenized/checkout/create`, {
            mode: "0011",
            payerReference: orderId,
            callbackURL: `http://localhost:5000/api/bkash/callback`, // BACKEND Callback Route
            amount: amount,
            currency: "BDT",
            intent: "sale",
            merchantInvoiceNumber: "Inv" + uuidv4().substring(0, 5)
        }, { headers });

        if (data && data.bkashURL) {
            return res.json({ bkashURL: data.bkashURL });
        } else {
            return res.status(400).json({ message: "Bkash Create Failed", debug: data });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const bkashCallback = async (req, res) => {
    const { paymentID, status } = req.query;

    if (status === 'cancel' || status === 'failure') {
        return res.redirect(`${process.env.FRONTEND_URL}/order/failed`);
    }

    try {
        const headers = await getHeaders();

        // 3. Execute Payment (Confirm it)
        const { data } = await axios.post(`${process.env.BKASH_BASE_URL}/tokenized/checkout/execute`, {
            paymentID
        }, { headers });

        if (data && data.statusCode === '0000') {
            // SUCCESS! Update your DB here (Set isPaid = true)
            // const order = await Order.findById(data.payerReference);
            // order.isPaid = true; await order.save();

            return res.redirect(`${process.env.FRONTEND_URL}/order/success`);
        } else {
            return res.redirect(`${process.env.FRONTEND_URL}/order/failed`);
        }
    } catch (error) {
        return res.redirect(`${process.env.FRONTEND_URL}/order/failed`);
    }
};
