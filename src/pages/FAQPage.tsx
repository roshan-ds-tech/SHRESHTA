import React from 'react';
import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

const faqs = [
  {
    category: 'Product Information',
    questions: [
      {
        q: 'What is jaggery and how is it different from sugar?',
        a: 'Jaggery is a traditional unrefined sweetener made from sugarcane juice or palm sap. Unlike refined sugar, jaggery retains minerals like iron, magnesium, and potassium, making it a healthier alternative. It has a rich, caramel-like flavor and is packed with nutrients.',
      },
      {
        q: 'Are your products 100% Pure?',
        a: 'Yes, all our jaggery products are made from certified sugarcane grown without the use of chemical pesticides or fertilizers. We follow traditional, eco-friendly farming practices to ensure the highest quality and purity.',
      },
      {
        q: 'What types of jaggery do you offer?',
        a: 'We offer three main varieties: Cube Jaggery (solid blocks perfect for daily use), Liquid Jaggery (smooth and easy to mix), and Powder Jaggery (fine powder ideal for baking and beverages). Each variety is available in different grades to suit your needs.',
      },
      {
        q: 'How should I store jaggery?',
        a: 'Store jaggery in an airtight container in a cool, dry place away from direct sunlight. Properly stored jaggery can last for several months. If liquid jaggery crystallizes, gently warm it to restore its consistency.',
      },
    ],
  },
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'What are the shipping charges?',
        a: 'We offer FREE shipping on orders above ₹500. For orders below ₹500, a flat shipping charge of ₹50 applies. We deliver across India.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Orders are typically processed within 1-2 business days and delivered within 3-7 business days depending on your location. You will receive a tracking number once your order is dispatched.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes! Once your order is shipped, you will receive a tracking number via email and SMS. You can use this to track your order in real-time.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently, we ship only within India. We are working on expanding our delivery network to international destinations. Please check back soon!',
      },
    ],
  },
  {
    category: 'Payment & Security',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major payment methods including Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery (COD). All online payments are processed through secure payment gateways.',
      },
      {
        q: 'Is it safe to use my credit card on your website?',
        a: 'Absolutely! We use industry-standard SSL encryption to protect your personal and payment information. We do not store any card details on our servers.',
      },
      {
        q: 'Can I cancel or modify my order?',
        a: 'You can cancel or modify your order within 2 hours of placing it by contacting our customer support. Once the order is processed, cancellation may not be possible.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 7-day return policy from the date of delivery. If you receive a damaged or incorrect product, please contact us immediately with photos, and we will arrange a replacement or full refund.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Contact our customer support team via email (support@shreshta.com) or phone (+91 98765 43210) with your order number and reason for return. Our team will guide you through the process.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 7-10 business days after we receive the returned product. The amount will be credited to your original payment method.',
      },
    ],
  },
  {
    category: 'Health & Usage',
    questions: [
      {
        q: 'Is jaggery suitable for diabetics?',
        a: 'While jaggery has a lower glycemic index than refined sugar, it still contains sugars and should be consumed in moderation by diabetics. We recommend consulting with your healthcare provider before adding jaggery to your diet.',
      },
      {
        q: 'Can children consume jaggery?',
        a: 'Yes, jaggery is safe and nutritious for children. It is rich in iron and minerals that support healthy growth. However, like any sweetener, it should be given in moderation.',
      },
      {
        q: 'How can I use jaggery in my daily diet?',
        a: 'Jaggery is incredibly versatile! You can use it to sweeten tea, coffee, milk, or smoothies. It is also perfect for traditional sweets, baking, cooking savory dishes, and even as a natural remedy for colds and coughs.',
      },
    ],
  },
];

export function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E7] to-white">
      {/* Hero Section */}
      <section className="bg-[#2C1810] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl text-[#FFF8E7] mb-4 font-serif"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#C5A572] max-w-2xl mx-auto"
          >
            Find answers to common questions about our products, orders, and services
          </motion.p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl text-[#2C1810] mb-6 font-serif border-b-2 border-[#D4AF37] pb-2">
                {category.category}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                  >
                    <AccordionItem
                      value={`item-${categoryIndex}-${index}`}
                      className="bg-white rounded-lg border-2 border-[#C5A572]/20 px-6 transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-md"
                    >
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <AccordionTrigger className="text-left text-[#2C1810] hover:text-[#D4AF37] hover:no-underline cursor-pointer transition-all duration-300">
                          <motion.span
                            initial={{ opacity: 0.8 }}
                            whileHover={{ opacity: 1, x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            {faq.q}
                          </motion.span>
                        </AccordionTrigger>
                      </motion.div>
                      <AccordionContent className="text-[#5C4033]">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                          {faq.a}
                        </motion.div>
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-[#F5E6D3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl text-[#2C1810] mb-4 font-serif">
              Still have questions?
            </h2>
            <p className="text-[#5C4033] mb-8">
              Our customer support team is here to help! Reach out to us and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:support@shreshta.com">
                <button className="px-6 py-3 bg-[#D4AF37] text-[#2C1810] rounded-lg hover:bg-[#C5A572] transition-colors" style={{cursor: "pointer"}}>
                  Email Us
                </button>
              </a>
              <a href="tel:+919876543210">
                <button className="px-6 py-3 bg-white border-2 border-[#D4AF37] text-[#2C1810] rounded-lg hover:bg-[#D4AF37]/10 transition-colors" style={{cursor: "pointer"}}>
                  Call Us
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
