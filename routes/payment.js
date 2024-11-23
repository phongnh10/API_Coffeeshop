const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const PayOS = require("@payos/node");

dotenv.config();
const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

router.post("/create-embedded-payment-link", async (req, res) => {
  const { orderCode, amount, description, items, returnUrl, cancelUrl } =
    req.body;

  if (!orderCode || !amount || !returnUrl || !cancelUrl) {
    return res.status(400).send({
      message:
        "Missing required fields: orderCode, amount, returnUrl, cancelUrl",
    });
  }

  const body = {
    orderCode,
    amount,
    description,
    items,
    returnUrl,
    cancelUrl,
  };

  try {
    const paymentLinkResponse = await payOS.createPaymentLink(body);
    res.status(200).send(paymentLinkResponse);
  } catch (error) {
    console.error("Error creating payment link:", error.message);
    res.status(500).send({
      message: "Failed to create payment link",
      error: error.message,
    });
  }
});

module.exports = router;
