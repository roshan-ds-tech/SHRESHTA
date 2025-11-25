import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted');
  };

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
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#C5A572] max-w-2xl mx-auto"
          >
            We'd love to hear from you. Reach out to us for any queries or feedback.
          </motion.p>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl text-[#2C1810] mb-6 font-serif">Contact Information</h2>
                <p className="text-[#5C4033] mb-8">
                  Have questions about our products or need assistance with your order? Our team is here to help!
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border-2 border-[#D4AF37] flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-[#2C1810] mb-1">Address</h3>
                    <p className="text-sm text-[#5C4033]">
                      123 Jaggery Lane, Farm District<br />
                      Mumbai, Maharashtra 400001<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border-2 border-[#D4AF37] flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-[#2C1810] mb-1">Phone</h3>
                    <p className="text-sm text-[#5C4033]">
                      +91 98765 43210<br />
                      +91 98765 43211 (Customer Support)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border-2 border-[#D4AF37] flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-[#2C1810] mb-1">Email</h3>
                    <p className="text-sm text-[#5C4033]">
                      info@shreshta.com<br />
                      support@shreshta.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border-2 border-[#D4AF37] flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-[#2C1810] mb-1">Business Hours</h3>
                    <p className="text-sm text-[#5C4033]">
                      Monday - Saturday: 9:00 AM - 6:00 PM<br />
                      Sunday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-8">
                <div className="w-full h-64 bg-[#F5E6D3] rounded-lg border-2 border-[#C5A572]/30 flex items-center justify-center">
                  <p className="text-[#5C4033]">Map Location</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-[#C5A572]/30 p-8"
            >
              <h2 className="text-2xl text-[#2C1810] mb-6 font-serif">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-[#2C1810]">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Roshan"
                      className="mt-1 border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-[#2C1810]">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="DS"
                      className="mt-1 border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-[#2C1810]">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="mt-1 border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-[#2C1810]">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="mt-1 border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-[#2C1810]">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="How can we help you?"
                    className="mt-1 border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-[#2C1810]">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    className="mt-1 border-[#C5A572] focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#D4AF37] text-[#2C1810] hover:bg-[#C5A572] py-6"
                >
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
