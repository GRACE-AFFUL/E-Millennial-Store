E-Millennial Store
A responsive gadget storefront demo built with HTML, CSS, and vanilla JavaScript. The project includes a product catalogue, interactive shopping cart, quantity adjustments, checkout form validation, and an optional Paystack test-mode checkout flow.
Features
Responsive landing page and product catalogue
Add products to the cart and adjust quantities
Customer details form with client-side validation
Order summary interface
Optional Paystack test-mode payment popup
Technologies
HTML5, CSS3, JavaScript, and Paystack Inline JS.
Run locally
Download or clone the repository.
Open `index.html` in a browser, or serve the directory using a local development server.
Browse products and test the shopping cart.
Paystack setup (optional)
The included `cart.js` uses `YOUR_PAYSTACK_TEST_PUBLIC_KEY` as a placeholder. To test the payment popup, replace this placeholder with your own Paystack test public key. Never commit a Paystack secret key or live credentials.
Important: This is a frontend demonstration, not a production payment or order-processing system. A production integration requires secure server-side transaction verification before confirming payment or fulfilling an order. The checkout amount is calculated on the client and must not be trusted for real transactions.
Author
Grace Afful
