import React, { useState } from "react";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
        
        {/* Info */}
        <div>
          <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
          <p className="text-neutral-400 mb-12 max-w-md leading-relaxed">
            Have a question about a product, your order, or just want to say hi? We're here to help. Fill out the form or reach out via email.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold tracking-widest uppercase text-neutral-500 mb-2">Support Email</h3>
              <a href="mailto:support@zeron.design" className="text-lg hover:text-neutral-300 transition-colors">support@zeron.design</a>
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-widest uppercase text-neutral-500 mb-2">Instagram</h3>
              <a href="https://www.instagram.com/zeronstore.in?igsi=Y2lrbm5kM3o5aHZk" target="_blank" rel="noopener noreferrer" className="text-lg hover:text-neutral-300 transition-colors">@ZERONSTORE.IN</a>
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-widest uppercase text-neutral-500 mb-2">Business Hours</h3>
              <p className="text-lg text-neutral-300">Monday - Friday: 10AM - 6PM IST</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          {isSubmitted ? (
            <div className="bg-neutral-950 border border-neutral-900 p-12 text-center rounded-sm h-full flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-4">Message Sent</h2>
              <p className="text-neutral-400">Thanks for reaching out. We'll get back to you within 24-48 hours.</p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-8 text-sm font-bold tracking-widest uppercase border-b border-white pb-1 inline-block mx-auto hover:text-neutral-400 transition-colors"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input required type="text" id="name" placeholder="Name" className="w-full bg-neutral-950 border border-neutral-900 rounded-sm px-4 py-4 text-sm focus:outline-none focus:border-white transition-colors" />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input required type="email" id="email" placeholder="Email" className="w-full bg-neutral-950 border border-neutral-900 rounded-sm px-4 py-4 text-sm focus:outline-none focus:border-white transition-colors" />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="sr-only">Subject</label>
                <input required type="text" id="subject" placeholder="Subject" className="w-full bg-neutral-950 border border-neutral-900 rounded-sm px-4 py-4 text-sm focus:outline-none focus:border-white transition-colors" />
              </div>
              
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea required id="message" rows={6} placeholder="How can we help?" className="w-full bg-neutral-950 border border-neutral-900 rounded-sm px-4 py-4 text-sm focus:outline-none focus:border-white transition-colors resize-none"></textarea>
              </div>
              
              <button type="submit" className="w-full bg-white text-black py-4 font-bold tracking-widest uppercase text-sm hover:bg-neutral-200 transition-colors rounded-sm">
                Send Message
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
