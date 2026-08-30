export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=2000" 
          alt="ZERON Design" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">DESIGN YOUR SPACE.</h1>
          <p className="text-lg text-neutral-300 font-light">ZERON exists to make ordinary setups feel personal.</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-sm font-bold tracking-widest uppercase text-neutral-500 mb-8">Our Story</h2>
        <div className="space-y-8 text-lg text-neutral-300 leading-relaxed font-light">
          <p>
            We believe that your workspace is an extension of your identity. Whether you are a creative professional, a dedicated gamer, or someone who simply appreciates clean aesthetics, the environment you build around yourself matters.
          </p>
          <p>
            ZERON was founded on a simple principle: to create original, high-quality designs for people who care about their workspace. We step away from the loud, chaotic designs often found in the gaming industry, focusing instead on premium, minimal, and modern visual identities.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 bg-neutral-950 border-y border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="aspect-square bg-neutral-900">
              <img src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=1000" alt="Texture" className="w-full h-full object-cover grayscale opacity-80" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-8">Design Philosophy</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-3">Minimalism with Purpose</h3>
                  <p className="text-neutral-400 leading-relaxed">Every element on our products serves a purpose. We strip away the unnecessary to focus on what truly matters: quality, feel, and aesthetic balance.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Quality Construction</h3>
                  <p className="text-neutral-400 leading-relaxed">A beautiful design means nothing if the product doesn't perform. We use premium fabrics, high-density anti-slip bases, and seamless stitching to ensure longevity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-24 max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <FaqItem question="What sizes are available?" answer="Our desk mats typically come in Medium (450x400mm), Large (900x400mm), and XL (1000x500mm). Check individual product pages for specific availability." />
          <FaqItem question="What material are the mouse pads made from?" answer="We use a variety of premium surfaces depending on the model, including micro-woven cloth for balanced glide, and textured hybrid weaves for maximum control. All mats feature a natural rubber anti-slip base." />
          <FaqItem question="How do I clean my mouse pad?" answer="For most of our cloth pads, we recommend spot cleaning with a damp microfiber cloth and mild soap. Air dry completely before use. Do not machine wash unless explicitly stated on the product page." />
          <FaqItem question="How long does delivery take?" answer="Standard delivery within India takes 3-7 business days. Metro cities usually see faster delivery times." />
          <FaqItem question="Do you accept returns?" answer="Yes, we accept returns within 14 days of delivery for unused items in their original packaging. Please see our Return Policy for full details." />
          <FaqItem question="Do you offer COD?" answer="Yes, Cash on Delivery is available for most pin codes across India." />
        </div>
      </section>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="border border-neutral-900 bg-neutral-950 p-6 rounded-sm">
      <h3 className="font-bold mb-3">{question}</h3>
      <p className="text-sm text-neutral-400 leading-relaxed">{answer}</p>
    </div>
  );
}
