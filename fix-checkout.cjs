const fs = require('fs');
let code = fs.readFileSync('src/pages/CheckoutPage.tsx', 'utf-8');

const sendEmailFunction = `
  const sendEmailFrontend = async (emailPayload: any) => {
    if (!emailPayload) return;
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: "94bab13c-8bf6-4f17-b2f3-92297938eac8",
          subject: emailPayload.subject,
          from_name: "ZERON Storefront",
          message: emailPayload.message,
        })
      });
    } catch (e) {
      console.error("Failed to send Web3Forms email from frontend:", e);
    }
  };
`;

// Insert the helper function before handleSubmit
code = code.replace('const handleSubmit = async', sendEmailFunction + '\n  const handleSubmit = async');

// Update COD flow
code = code.replace(
`      if (data.paymentMethod === 'COD') {
        clearCart();
        navigate(\`/order-success/\${data.dbOrderId}\`);
        return;
      }`,
`      if (data.paymentMethod === 'COD') {
        if (data.emailPayload) await sendEmailFrontend(data.emailPayload);
        clearCart();
        navigate(\`/order-success/\${data.dbOrderId}\`);
        return;
      }`
);

// Update Prepaid flow
code = code.replace(
`            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");
            
            clearCart();
            navigate(\`/order-success/\${data.dbOrderId}\`);`,
`            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");
            
            if (verifyData.emailPayload) await sendEmailFrontend(verifyData.emailPayload);
            clearCart();
            navigate(\`/order-success/\${data.dbOrderId}\`);`
);

fs.writeFileSync('src/pages/CheckoutPage.tsx', code);
