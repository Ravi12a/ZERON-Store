import { useParams } from "react-router-dom";

export default function PolicyPage() {
  const { slug } = useParams();

  const getPolicyContent = () => {
    switch(slug) {
      case 'privacy':
        return {
          title: "Privacy Policy",
          content: "[PLACEHOLDER: Final privacy policy content to be provided by the legal team. This section will outline data collection, usage, cookies, and third-party sharing practices.]"
        };
      case 'terms':
        return {
          title: "Terms & Conditions",
          content: "[PLACEHOLDER: Final terms of service to be provided by the legal team. This section will govern the use of the website, limitations of liability, and user obligations.]"
        };
      case 'shipping':
        return {
          title: "Shipping Policy",
          content: "[PLACEHOLDER: Shipping rates, delivery timelines, tracking information, and international shipping policies.]"
        };
      case 'returns':
        return {
          title: "Return & Refund Policy",
          content: "Our products are made on demand specifically for each order. Because of this, we generally do not accept returns or exchanges for change of mind, incorrect selection, personal preference, or ordering by mistake.\n\nIf your order arrives damaged, defective, incorrect, or has a genuine production/fulfilment issue, please contact ZERON customer support as soon as possible with your order details and clear photos/videos of the issue. We will review the case and, where applicable, work with our fulfilment partner to provide an appropriate resolution."
        };
      default:
        return {
          title: "Policy Not Found",
          content: "The requested policy page could not be found."
        };
    }
  }

  const { title, content } = getPolicyContent();

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 w-full">
      <h1 className="text-3xl font-bold mb-12 tracking-widest uppercase">{title}</h1>
      <div className="prose prose-invert max-w-none">
        <p className="text-neutral-400 leading-relaxed bg-neutral-950 p-6 border border-neutral-900 rounded-sm">
          {content}
        </p>
      </div>
    </div>
  );
}
