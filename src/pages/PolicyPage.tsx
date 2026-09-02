import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";

interface PolicySection {
  title: string;
  content: React.ReactNode;
}

interface PolicyData {
  title: string;
  updatedAt?: string;
  intro?: React.ReactNode;
  sections: PolicySection[];
}

export default function PolicyPage() {
  const { slug } = useParams();

  const getPolicyContent = (): PolicyData => {
    switch(slug) {
      case 'shipping':
        return {
          title: "SHIPPING POLICY",
          updatedAt: "September 3, 2026",
          intro: (
            <>
              <p className="mb-4 font-bold text-white tracking-widest uppercase">
                DESIGNED BY ZERON.<br/>
                MADE ON DEMAND.<br/>
                FULFILLED BY QIKINK.
              </p>
              <p className="mb-4">
                ZERON is a print-on-demand design brand. Our products are designed by ZERON and produced and fulfilled through our print-on-demand fulfilment partner, Qikink.
              </p>
              <p>
                ZERON manages the customer-facing order process, while product production, packing, shipping and delivery are handled by our fulfilment partner.
              </p>
            </>
          ),
          sections: [
            {
              title: "1. HOW FULFILMENT WORKS",
              content: (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black font-bold text-sm shrink-0">1</span>
                    <p className="pt-1">Customer places an order on ZERON.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black font-bold text-sm shrink-0">2</span>
                    <p className="pt-1">ZERON receives and processes the order.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black font-bold text-sm shrink-0">3</span>
                    <p className="pt-1">The order is sent to our print-on-demand fulfilment partner, Qikink.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black font-bold text-sm shrink-0">4</span>
                    <p className="pt-1">Qikink produces the product specifically for the order.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black font-bold text-sm shrink-0">5</span>
                    <p className="pt-1">Qikink packs the product.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black font-bold text-sm shrink-0">6</span>
                    <p className="pt-1">Qikink ships the package through its delivery/courier network.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black font-bold text-sm shrink-0">7</span>
                    <p className="pt-1">The package is delivered to the customer's provided address.</p>
                  </div>
                </div>
              )
            },
            {
              title: "2. PRODUCTION & PROCESSING",
              content: (
                <p>
                  Because ZERON products are made on demand, production begins after an order is placed and processed for fulfilment. Production and dispatch timelines may vary depending on the product, order volume and fulfilment operations.
                </p>
              )
            },
            {
              title: "3. SHIPPING & DELIVERY",
              content: (
                <>
                  <p className="mb-4 text-white font-medium">Shipping and delivery are handled by Qikink, our print-on-demand fulfilment partner.</p>
                  <p className="mb-4">Delivery time can vary depending on:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Customer location</li>
                    <li>Production time</li>
                    <li>Courier operations</li>
                    <li>Weather</li>
                    <li>Public holidays</li>
                    <li>Remote locations</li>
                    <li>Other logistical circumstances</li>
                  </ul>
                </>
              )
            },
            {
              title: "4. SHIPPING CHARGES",
              content: (
                <p>
                  Any applicable shipping charges are displayed during checkout before the customer places the order. If checkout shows free shipping, no shipping charge is added to the customer order.
                </p>
              )
            },
            {
              title: "5. TRACKING",
              content: (
                <p>
                  Where tracking information is available, shipment tracking may be provided through the order communication or available tracking system.
                </p>
              )
            },
            {
              title: "6. DELIVERY ADDRESS",
              content: (
                <>
                  <p className="mb-4">Customers are responsible for entering an accurate:</p>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Full name</li>
                    <li>Address</li>
                    <li>Apartment/building details where applicable</li>
                    <li>City</li>
                    <li>State</li>
                    <li>PIN code</li>
                    <li>Phone number</li>
                  </ul>
                  <p>
                    Incorrect or incomplete information can cause delivery problems or delays.
                  </p>
                </>
              )
            },
            {
              title: "7. DELIVERY PROBLEMS",
              content: (
                <>
                  <p className="mb-4">
                    If your order arrives damaged, defective, incorrect, or has a genuine production/fulfilment issue, please contact ZERON customer support as soon as possible with your order details and clear photos/videos where appropriate.
                  </p>
                  <p className="mb-4">
                    ZERON will review the issue and coordinate with the fulfilment partner where necessary.
                  </p>
                  <p className="font-bold text-white">
                    CUSTOMERS SHOULD CONTACT ZERON, NOT QIKINK, FOR THEIR ZERON ORDER.
                  </p>
                </>
              )
            },
            {
              title: "8. INTERNATIONAL SHIPPING",
              content: (
                <p>
                  ZERON currently focuses on orders within India. International shipping availability, if introduced in the future, will be communicated separately.
                </p>
              )
            }
          ]
        };

      case 'privacy':
        return {
          title: "PRIVACY POLICY",
          updatedAt: "September 3, 2026",
          intro: (
            <p>
              ZERON respects your privacy and is committed to handling your personal information responsibly when you use our website, create an account, place an order, contact us, or otherwise interact with our services.
            </p>
          ),
          sections: [
            {
              title: "1. INFORMATION WE COLLECT",
              content: (
                <>
                  <p className="mb-4">ZERON may collect information such as:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Billing/shipping information</li>
                    <li>City, state and PIN code</li>
                    <li>Order information</li>
                    <li>Payment-related transaction information</li>
                    <li>Account information</li>
                    <li>Customer support communications</li>
                    <li>Information voluntarily submitted through forms</li>
                  </ul>
                </>
              )
            },
            {
              title: "2. HOW WE USE INFORMATION",
              content: (
                <>
                  <p className="mb-4">Information may be used to:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Process and fulfil orders</li>
                    <li>Verify orders</li>
                    <li>Contact customers about orders</li>
                    <li>Confirm Cash on Delivery orders</li>
                    <li>Provide customer support</li>
                    <li>Send order-related communications</li>
                    <li>Process payments through payment providers</li>
                    <li>Improve website functionality</li>
                    <li>Maintain account and order history</li>
                    <li>Prevent fraud, misuse and security issues</li>
                    <li>Comply with applicable legal requirements</li>
                  </ul>
                </>
              )
            },
            {
              title: "3. PAYMENT INFORMATION",
              content: (
                <p>
                  Online payments are processed through third-party payment service providers. ZERON does not intentionally store customers' complete card numbers, CVV numbers, UPI PINs, banking passwords or other highly sensitive payment credentials.
                </p>
              )
            },
            {
              title: "4. COOKIES & TECHNOLOGIES",
              content: (
                <>
                  <p className="mb-4">The website may use cookies, local storage or similar technologies for:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Cart functionality</li>
                    <li>Authentication/session management</li>
                    <li>Website preferences</li>
                    <li>Analytics or essential functionality where implemented</li>
                  </ul>
                </>
              )
            },
            {
              title: "5. THIRD-PARTY SERVICE PROVIDERS",
              content: (
                <>
                  <p className="mb-4">ZERON may work with third-party service providers required to operate the store, such as:</p>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Payment providers</li>
                    <li>Print-on-demand/fulfilment partners</li>
                    <li>Shipping/courier providers</li>
                    <li>Email/communication providers</li>
                    <li>Website hosting and infrastructure providers</li>
                  </ul>
                  <p className="mb-4">
                    ZERON may share necessary order information with its print-on-demand fulfilment partner, Qikink, to produce and fulfil customer orders.
                  </p>
                  <p className="mb-4">Information necessary for fulfilment may include:</p>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Customer name</li>
                    <li>Shipping address</li>
                    <li>Phone number</li>
                    <li>Order details</li>
                    <li>Product/variant information</li>
                    <li>Quantity</li>
                    <li>Other information necessary to fulfil the order</li>
                  </ul>
                  <p className="mb-4">
                    Qikink uses the information provided to it as necessary to perform fulfilment, production, shipping and delivery services for ZERON orders.
                  </p>
                  <p>
                    Information is shared only as reasonably necessary to provide the relevant service, process orders, communicate with customers, or comply with legal obligations. Payment providers receive the information necessary to process payments.
                  </p>
                </>
              )
            },
            {
              title: "6. DATA SECURITY",
              content: <p>Reasonable technical and organisational measures are used to protect information.</p>
            },
            {
              title: "7. DATA RETENTION",
              content: (
                <>
                  <p className="mb-4">Information may be retained for as long as reasonably necessary for:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Order fulfilment</li>
                    <li>Customer support</li>
                    <li>Accounting/business records</li>
                    <li>Legal obligations</li>
                    <li>Fraud prevention</li>
                    <li>Resolving disputes</li>
                  </ul>
                </>
              )
            },
            {
              title: "8. YOUR RIGHTS",
              content: (
                <p>
                  Depending on applicable law, you may have rights relating to access, correction, deletion or other handling of your personal information. Please contact ZERON support for privacy-related requests.
                </p>
              )
            },
            {
              title: "9. CHILDREN'S PRIVACY",
              content: (
                <p>
                  The website is not intended for children who are unable to legally use online shopping services independently, and ZERON does not knowingly request unnecessary personal information from children.
                </p>
              )
            },
            {
              title: "10. POLICY CHANGES",
              content: (
                <p>
                  ZERON may update this Privacy Policy when business practices, technology or legal requirements change. The updated version will be published on this page with a revised "Last Updated" date.
                </p>
              )
            },
            {
              title: "11. CONTACT",
              content: <p>Privacy questions can be sent to: support@zeron.design</p>
            }
          ]
        };

      case 'terms':
        return {
          title: "TERMS & CONDITIONS",
          updatedAt: "September 3, 2026",
          intro: (
            <>
              <p className="mb-4 font-bold text-white tracking-widest uppercase">
                DESIGNED BY ZERON.<br/>
                MADE ON DEMAND.<br/>
                FULFILLED BY QIKINK.
              </p>
              <p>
                These Terms & Conditions govern your use of the ZERON website and your purchase of products from ZERON. By accessing or using the website, you agree to these terms.
              </p>
            </>
          ),
          sections: [
            {
              title: "1. ABOUT ZERON",
              content: (
                <>
                  <p className="mb-4">
                    ZERON is a print-on-demand design brand focused on creating modern gaming and workspace aesthetics.
                  </p>
                  <p>
                    ZERON creates and manages the designs offered through the website. Physical products are produced, packed and fulfilled through our print-on-demand fulfilment partner, Qikink.
                  </p>
                </>
              )
            },
            {
              title: "2. PRINT-ON-DEMAND FULFILMENT",
              content: (
                <>
                  <p className="mb-4">
                    ZERON operates using a print-on-demand fulfilment model. Products are produced specifically for customer orders rather than being held as conventional ready-to-ship inventory by ZERON.
                  </p>
                  <p className="mb-4">
                    ZERON is responsible for the design and customer-facing store experience. Qikink acts as ZERON's print-on-demand fulfilment partner and handles the physical production, printing, packing, shipping and delivery of products.
                  </p>
                  <p className="font-bold text-white">
                    Because production takes place after an order is placed, customers should carefully verify their product, variant, quantity, shipping address and contact information before completing checkout.
                  </p>
                </>
              )
            },
            {
              title: "3. USE OF THE WEBSITE",
              content: (
                <>
                  <p className="mb-4">Customers agree to:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Provide accurate information</li>
                    <li>Use the website lawfully</li>
                    <li>Not attempt to disrupt or abuse the website</li>
                    <li>Not misuse accounts or payment systems</li>
                    <li>Not submit fraudulent orders</li>
                    <li>Not interfere with website security</li>
                  </ul>
                </>
              )
            },
            {
              title: "4. PRODUCTS",
              content: (
                <ul className="list-disc pl-5 space-y-1">
                  <li>Products are made on demand.</li>
                  <li>Product images are provided for representation and actual colours may vary slightly depending on screen settings and printing.</li>
                  <li>Product specifications, availability and pricing may change.</li>
                  <li>ZERON may correct genuine pricing, description or availability errors.</li>
                </ul>
              )
            },
            {
              title: "5. ORDERS",
              content: (
                <ul className="list-disc pl-5 space-y-1">
                  <li>An order is submitted when the customer completes the checkout process.</li>
                  <li>When an order is successfully placed on the ZERON website, ZERON processes the order and arranges fulfilment through its print-on-demand fulfilment partner.</li>
                  <li>ZERON may contact the customer on the provided phone number to confirm a Cash on Delivery order before it is processed for fulfilment.</li>
                  <li>ZERON reserves the right to cancel or refuse an order in cases such as suspected fraud, incorrect information, product unavailability, pricing errors or operational limitations.</li>
                </ul>
              )
            },
            {
              title: "6. PAYMENT",
              content: (
                <>
                  <p className="mb-4">Supported payment methods may include:</p>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Online Payment</li>
                    <li>Cash on Delivery</li>
                  </ul>
                  <p>
                    Online payments are processed through the integrated payment provider. For COD orders, payment is collected at delivery according to the applicable delivery process.
                  </p>
                </>
              )
            },
            {
              title: "7. PRICING & COUPONS",
              content: (
                <ul className="list-disc pl-5 space-y-1">
                  <li>Prices shown on the website are in Indian Rupees unless stated otherwise.</li>
                  <li>Applicable shipping charges are shown at checkout.</li>
                  <li>Promotional coupons are subject to their individual eligibility rules.</li>
                  <li>ZERON may cancel or reject coupon use when eligibility requirements are not met or misuse is detected.</li>
                </ul>
              )
            },
            {
              title: "8. SHIPPING & DELIVERY",
              content: (
                <p>
                  Physical product shipping and delivery are handled by Qikink and its applicable shipping/courier network. ZERON manages the customer-facing support and order communication.
                </p>
              )
            },
            {
              title: "9. MADE-TO-ORDER PRODUCTS",
              content: (
                <p className="font-semibold text-white">
                  Because products are produced specifically for each order, customers should carefully verify product selection, variant, quantity, address and contact information before placing an order.
                </p>
              )
            },
            {
              title: "10. RETURNS, REFUNDS & DEFECTIVE PRODUCTS",
              content: (
                <>
                  <p className="mb-4">ZERON generally does not accept returns or exchanges for:</p>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Change of mind</li>
                    <li>Incorrect product selection</li>
                    <li>Incorrect variant selection</li>
                    <li>Personal preference</li>
                    <li>Ordering by mistake</li>
                  </ul>
                  <p className="mb-4">Genuine cases involving:</p>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Damaged products</li>
                    <li>Defective products</li>
                    <li>Incorrect products</li>
                    <li>Production/fulfilment issues</li>
                  </ul>
                  <p>
                    may be reviewed by ZERON. Customers should contact support as soon as possible with their order details and clear photos/videos where appropriate.
                  </p>
                </>
              )
            },
            {
              title: "11. ORDER CONFIRMATION",
              content: (
                <p>
                  After placing an order, a ZERON representative may call the customer on the provided phone number to confirm the order before it is processed for fulfilment.
                </p>
              )
            },
            {
              title: "12. INTELLECTUAL PROPERTY",
              content: (
                <p>
                  ZERON branding, logos, product artwork, website design, text, graphics, photography and other original content are owned by or licensed to ZERON and may not be copied, reproduced, modified, distributed or commercially exploited without permission.
                </p>
              )
            },
            {
              title: "13. THIRD-PARTY SERVICES",
              content: (
                <>
                  <p className="mb-4">
                    ZERON relies on third-party service providers to operate certain parts of the business. This includes payment processing, print-on-demand fulfilment, shipping/delivery, email communication and website infrastructure where applicable.
                  </p>
                  <p className="mb-4 font-bold text-white">
                    Qikink is ZERON's print-on-demand fulfilment partner responsible for the physical production and fulfilment of ZERON products.
                  </p>
                  <p>Those services may have their own terms and privacy policies.</p>
                </>
              )
            },
            {
              title: "14. WEBSITE AVAILABILITY",
              content: (
                <p>
                  ZERON aims to keep the website available but cannot guarantee uninterrupted or error-free operation. Maintenance, technical problems or circumstances outside ZERON's control may temporarily affect availability.
                </p>
              )
            },
            {
              title: "15. LIMITATION OF LIABILITY",
              content: (
                <p>
                  ZERON is not responsible for losses arising from circumstances outside its reasonable control, subject to applicable law.
                </p>
              )
            },
            {
              title: "16. CHANGES TO TERMS",
              content: (
                <p>
                  ZERON may update these Terms & Conditions when necessary. Updated terms will be published on this page with a revised "Last Updated" date.
                </p>
              )
            },
            {
              title: "17. GOVERNING LAW",
              content: (
                <p>
                  These Terms & Conditions are governed by the laws applicable in India, subject to applicable consumer protection and other mandatory legal rights.
                </p>
              )
            },
            {
              title: "18. CONTACT",
              content: <p>For questions regarding these Terms & Conditions: support@zeron.design</p>
            }
          ]
        };

      case 'returns':
        return {
          title: "RETURN & REFUND POLICY",
          updatedAt: "September 3, 2026",
          intro: (
            <>
              <p className="mb-4 font-bold text-white tracking-widest uppercase">
                DESIGNED BY ZERON.<br/>
                MADE ON DEMAND.<br/>
                FULFILLED BY QIKINK.
              </p>
              <p>
                ZERON products are made on demand specifically for each customer order. ZERON designs the products, while production and fulfilment are handled through our print-on-demand fulfilment partner, Qikink.
              </p>
            </>
          ),
          sections: [
            {
              title: "GENERAL POLICY",
              content: (
                <>
                  <p className="mb-4">
                    Because products are produced specifically after an order is placed, we generally do not accept returns or exchanges for change of mind, incorrect selection, incorrect variant selection, personal preference, or orders placed by mistake.
                  </p>
                </>
              )
            },
            {
              title: "GENUINE ISSUES & DEFECTS",
              content: (
                <>
                  <p className="mb-4">
                    If an order arrives damaged, defective, incorrect, or has a genuine production or fulfilment issue, please contact ZERON customer support as soon as possible.
                  </p>
                  <p className="mb-4">Please provide:</p>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Order ID</li>
                    <li>Description of the problem</li>
                    <li>Clear photographs/videos</li>
                    <li>Any other information required to investigate the issue</li>
                  </ul>
                  <p>
                    ZERON will review the case and, where appropriate, coordinate with its fulfilment partner to determine the appropriate resolution.
                  </p>
                </>
              )
            }
          ]
        };

      default:
        return {
          title: "POLICY NOT FOUND",
          sections: [
            {
              title: "ERROR 404",
              content: <p>The requested policy page could not be found.</p>
            }
          ]
        };
    }
  }

  const policy = getPolicyContent();

  return (
    <div className="max-w-4xl mx-auto px-4 py-24 w-full text-neutral-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-white uppercase">{policy.title}</h1>
        {policy.updatedAt && (
          <p className="text-neutral-500 mb-12 text-sm tracking-wide">Last Updated: {policy.updatedAt}</p>
        )}
      </motion.div>

      <div className="space-y-12">
        {policy.intro && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg leading-relaxed text-neutral-200"
          >
            {policy.intro}
          </motion.div>
        )}

        <div className="space-y-12">
          {policy.sections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="scroll-mt-24"
            >
              <h2 className="text-xl font-semibold mb-4 text-white tracking-wide uppercase">
                {section.title}
              </h2>
              <div className="text-base leading-relaxed text-neutral-400">
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
