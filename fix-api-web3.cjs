const fs = require('fs');
let code = fs.readFileSync('api.ts', 'utf-8');

// Find sendWeb3FormsEmail
const funcStart = code.indexOf('async function sendWeb3FormsEmail');

if (funcStart > -1) {
  // Replace it with getWeb3FormsPayload
  let newFunc = `async function getWeb3FormsPayload(dbOrderId, token) {
  try {
    const userSupabase = getSupabaseClient(token);
    const { data: order, error } = await userSupabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', dbOrderId)
      .single();
      
    if (error || !order) return null;

    const formatItems = order.order_items.map((item, i) => \`Product \${i + 1}:\\nProduct Name:\\n\${item.product_name}\\n\\nQuantity:\\n\${item.quantity}\\n\\nZERON Product ID:\\n\${item.product_id}\\n\\nZERON Variant ID:\\n\${item.variant_id || 'N/A'}\\n\\nQikink Design SKU:\\n\${item.qikink_sku || 'N/A'}\\n\\nProduct Price:\\n₹\${item.unit_price}\\n\\nLine Total:\\n₹\${item.total_price}\`).join('\\n\\n');

    let customer = order.shipping_address;
    if (typeof customer === 'string') {
        try { customer = JSON.parse(customer); } catch(e) {}
    }

    const emailBody = \`--------------------------------\\nZERON NEW ORDER\\n--------------------------------\\n\\nOrder ID:\\n\${order.order_number}\\n\\nOrder Date:\\n\${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\\n\\nPayment Method:\\n\${order.payment_method === 'COD' ? 'COD' : 'ONLINE PAYMENT'}\\n\\nPayment Status:\\n\${order.payment_status === 'paid' ? 'PAID' : (order.payment_method === 'COD' ? 'COD' : order.payment_status)}\\n\\nOrder Status:\\nNEW - MANUAL QIKINK FULFILMENT\\n\\n--------------------------------\\nCUSTOMER DETAILS\\n--------------------------------\\n\\nCustomer Name:\\n\${order.customer_name}\\n\\nEmail:\\n\${order.customer_email}\\n\\nPhone:\\n\${order.customer_phone || 'N/A'}\\n\\n--------------------------------\\nSHIPPING ADDRESS\\n--------------------------------\\n\\nFirst Name:\\n\${order.customer_name.split(' ')[0]}\\n\\nLast Name:\\n\${order.customer_name.split(' ').slice(1).join(' ')}\\n\\nAddress:\\n\${customer.address_line_1 || customer.address || 'N/A'}\\n\\nApartment/Suite:\\n\${customer.address_line_2 || customer.apartment || 'N/A'}\\n\\nCity:\\n\${customer.city || 'N/A'}\\n\\nState:\\n\${customer.state || 'N/A'}\\n\\nPincode:\\n\${customer.postal_code || customer.pincode || 'N/A'}\\n\\nCountry:\\nIndia\\n\\n--------------------------------\\nORDER ITEMS\\n--------------------------------\\n\\n\${formatItems}\\n\\n--------------------------------\\nPRICE SUMMARY\\n--------------------------------\\n\\nSubtotal:\\n₹\${order.subtotal}\\n\\nDiscount:\\n-₹\${order.discount || 0}\\n\\nCoupon:\\n\${order.coupon_code || 'None'}\\n\\nShipping:\\n₹\${order.shipping_fee || 0}\\n\\nFinal Customer Total:\\n₹\${order.total}\\n\\n--------------------------------\\nFULFILMENT\\n--------------------------------\\n\\nFulfilment Method:\\nManual Qikink Fulfilment\\n\\nQikink Action:\\nSearch the Qikink Design SKU and manually create the order.\\n\\nPackaging:\\nBox Packing\\n\\nCustom Letter:\\nZERON Custom Thank You Letter\`;

    return {
      subject: \`New ZERON \${order.payment_method === 'COD' ? 'COD' : 'Paid'} Order - \${order.order_number}\`,
      message: emailBody
    };
  } catch (error) {
    console.error("Error generating Web3Forms payload:", error);
    return null;
  }
}
`;
  code = code.substring(0, funcStart) + newFunc;
  
  // Replace the calls
  code = code.replace(/await sendWeb3FormsEmail\(orderData\.id, token\);/g, 'const emailPayload = await getWeb3FormsPayload(orderData.id, token);\n      res.json({ success: true, dbOrderId: orderData.id, paymentMethod: \'COD\', emailPayload });\n      return;');
  // Also we need to make sure the original COD res.json is replaced properly or just return.
  
  // Wait, let's just do a direct string replace for the COD part
  code = code.replace(
      `      if (!missingMapping) {
         await sendWeb3FormsEmail(orderData.id, token);
      }
      res.json({ success: true, dbOrderId: orderData.id, paymentMethod: 'COD' });`,
      `      const emailPayload = await getWeb3FormsPayload(orderData.id, token);
      res.json({ success: true, dbOrderId: orderData.id, paymentMethod: 'COD', emailPayload });`
  );
  
  // And for the Verify part:
  code = code.replace(
      `    // Send Web3Forms Email
    await sendWeb3FormsEmail(dbOrderId, token);

    res.json({ success: true });`,
      `    // Send Web3Forms Email payload back
    const emailPayload = await getWeb3FormsPayload(dbOrderId, token);
    res.json({ success: true, emailPayload });`
  );

  fs.writeFileSync('api.ts', code);
}
