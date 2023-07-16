const { parse } = require("node-html-parser");
const axios = require("axios");

const validateProduct = async (product) => {
  if (product) {
    return product.replace(/\ /g, "+").replace(/"/g, "");
  }
  return false;
};

const getFlipkartProducts = async (keyword) => {
  let flipkart_products = [];
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.FLIPKART_URL}/search?q=${keyword}`,
  };
  const response = await axios.request(config);
  let content = parse(response.data);
  for (const element of content.querySelectorAll("._3pLy-c")) {
    let title = element.innerHTML.split('"_4rR01T">')[1].split("</div>")[0];
    let price = element.innerHTML
      .split('"_30jeq3 _1_WHN1">')[1]
      .split("</div>")[0];
    if (title.toLowerCase().includes(keyword.replace(/\+/g, " ").toLowerCase()))
      flipkart_products.push({ title, price });
  }
  return flipkart_products;
};

const getAmazonProducts = async (keyword) => {
  let amazon_products = [];
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${process.env.AMAZON_URL}/request?api_key=${process.env.API_KEY}&type=search&amazon_domain=${process.env.AMAZON_DOMAIN}&search_term=${keyword}`,
  };
  const response = await axios.request(config);
  let searchResults = response?.data?.search_results;
  if (searchResults) {
    for (const product of searchResults) {
      if (
        product.title
          .toLowerCase()
          .includes(keyword.replace(/\+/g, " ").toLowerCase())
      ) {
        amazon_products.push({
          title: product.title,
          price: product.prices
            ? product.prices[0].raw
            : "Currently unavailable",
        });
      }
    }
  }
  return amazon_products;
};

module.exports = { getFlipkartProducts, validateProduct, getAmazonProducts };
