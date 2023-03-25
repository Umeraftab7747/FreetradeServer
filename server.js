const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51JijtpJDks9SBIkvE0zVjKBFsHdNBZJftjtsJWlxRYE0c8SrVXGj4YenxEPzOSTlSySib98pmG2xBAb8afOGS81X00LbiTNMks"
);

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.post("/payment-sheet", async (req, res) => {
  console.warn("HEHEHEH");
  const { amount } = req.body;
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2020-08-27" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
  });
});

app.listen(port, () => {
  console.warn("RUNINGGGGG at " + port);
});
