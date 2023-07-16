const express = require("express");
const app = express();
const {
  getFlipkartProducts,
  validateProduct,
  getAmazonProducts,
} = require("./utils");
const dotenv = require("dotenv");

dotenv.config();

app.get("/", async (req, res) => {
  try {
    const result = await validateProduct(req.query.product);
    if (result) {
      const [flipkart_products, amazon_products] = await Promise.all([
        getFlipkartProducts(result),
        getAmazonProducts(result),
      ]);
      if (amazon_products.length || flipkart_products.length)
        res.send({ amazon_products, flipkart_products });
      else res.status(200).json("Product Not Found");
    } else res.status(400).json("Product is mising");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

app.listen(5000, () => console.log(`server running on port ${5000}`));
