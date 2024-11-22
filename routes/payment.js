const express = require("express");
const PayOS = require("@payos/node");
const Payment = require("./models/payment");
const router = express.Router();

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

router.post("/create-embedded-payment-link", async (req, res) => {
  const { orderCode, amount, description, returnUrl, cancelUrl } = req.body;

  try {
    const paymentLinkResponse = await payOS.createPaymentLink({
      orderCode,
      amount,
      description,
      returnUrl,
      cancelUrl,
    });

    const payment = new Payment({
      orderCode,
      amount,
      description,
      status: paymentLinkResponse.status,
    });
    await payment.save();

    res.send(paymentLinkResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Something went wrong", details: error });
  }
});

module.exports = router;
