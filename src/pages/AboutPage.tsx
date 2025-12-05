import React from 'react';
import { motion } from 'motion/react';
import { Heart, Users, Award, Sprout } from 'lucide-react';

export function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Passion for Purity',
      description: 'Every batch of jaggery is crafted with love and dedication to maintain the highest quality standards.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We work directly with local farmers, ensuring fair trade and sustainable farming practices.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Our commitment to quality has earned us recognition and the trust of thousands of customers.',
    },
    {
      icon: Sprout,
      title: 'Sustainability',
      description: 'We believe in eco-friendly practices that protect our planet for future generations.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1760445529387-455a90cba4d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybWluZyUyMGhhbmRzfGVufDF8fHx8MTc2MTMxMDc2MHww&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        >
          <div className="absolute inset-0 bg-[#2C1810]/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl text-[#FFF8E7] mb-4 font-serif">
              Our Story
            </h1>
            <p className="text-lg text-[#C5A572] max-w-2xl">
              A journey of tradition, purity, and excellence
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-gradient-to-b from-[#FFF8E7] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl text-[#2C1810] mb-6 font-serif">
              Crafted with Tradition, Delivered with Love
            </h2>
            <div className="space-y-6 text-[#5C4033]">
              <p>
                Shreshta was born from a simple belief: that the sweetness we add to our lives should be as pure and natural as possible. Our journey began in the lush sugarcane fields of rural India, where generations of farmers have perfected the art of making jaggery using traditional methods.
              </p>
              <p>
                We work closely with local farming communities, ensuring that every step of the process—from cultivation to packaging—adheres to the highest standards of quality and sustainability. Our jaggery is free from chemicals, additives, and preservatives, retaining all the natural nutrients and minerals that make it a healthier alternative to refined sugar.
              </p>
              <p>
                Today, Shreshta stands as a symbol of purity, authenticity, and trust. We are proud to bring the goodness of traditional jaggery to modern kitchens, helping families across the country embrace a healthier, more natural way of sweetening their lives.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Heritage */}
      <section className="py-20 bg-[#2C1810]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#3E2723] p-8 rounded-lg border-2 border-[#C5A572]/20"
            >
              <h3 className="text-2xl text-[#D4AF37] mb-4 font-serif">Our Mission</h3>
              <p className="text-[#F5E6D3]">
                To revive the age-old tradition of jaggery making and make premium quality, Premium jaggery accessible to every household. We strive to support local farmers, promote sustainable agriculture, and provide our customers with a healthier, more natural sweetener that nourishes both body and soul.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#3E2723] p-8 rounded-lg border-2 border-[#C5A572]/20"
            >
              <h3 className="text-2xl text-[#D4AF37] mb-4 font-serif">Our Heritage</h3>
              <p className="text-[#F5E6D3]">
                Our jaggery-making process is rooted in centuries-old traditions passed down through generations. We use authentic copper vessels, wood-fired furnaces, and traditional techniques that have stood the test of time. This heritage ensures that every piece of jaggery carries the authentic taste and nutritional benefits that our ancestors enjoyed.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-b from-white to-[#FFF8E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl text-[#2C1810] mb-4 font-serif">
              Our Core Values
            </h2>
            <p className="text-[#5C4033] max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 md:p-6 bg-white rounded-lg shadow-lg border-2 border-[#C5A572]/20 aspect-square flex flex-col items-center justify-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 bg-[#D4AF37]/10 rounded-full border-2 border-[#D4AF37]">
                  <value.icon className="w-6 h-6 md:w-8 md:h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-[#2C1810] mb-2 text-sm md:text-base font-semibold">{value.title}</h3>
                <p className="text-xs md:text-sm text-[#5C4033]">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Process */}
      <section className="py-20 bg-[#FFF8E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl text-[#2C1810] mb-4 font-serif">
              The Traditional Process
            </h2>
            <p className="text-[#5C4033] max-w-2xl mx-auto">
              From sugarcane fields to your table
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='mx-auto max-w-lg'
            >
              <img
                src="/about_us.jpg"
                alt="Traditional jaggery making process"
                className="rounded-2xl shadow-xl border-4 border-[#C5A572]/30 "
                style={{width: 350, height: 450}}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#2C1810]">
                  1
                </div>
                <div>
                  <h4 className="text-[#2C1810] mb-2">Harvesting</h4>
                  <p className="text-sm text-[#5C4033]">
                    Fresh sugarcane is carefully harvested from farms at peak ripeness to ensure maximum sweetness and nutrition.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#2C1810]">
                  2
                </div>
                <div>
                  <h4 className="text-[#2C1810] mb-2">Extraction</h4>
                  <p className="text-sm text-[#5C4033]">
                    The juice is extracted using traditional crushing methods, preserving all natural nutrients and minerals.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#2C1810]">
                  3
                </div>
                <div>
                  <h4 className="text-[#2C1810] mb-2">Boiling</h4>
                  <p className="text-sm text-[#5C4033]">
                    The juice is boiled in large copper vessels over wood fires, following centuries-old techniques.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#2C1810]">
                  4
                </div>
                <div>
                  <h4 className="text-[#2C1810] mb-2">Setting & Packaging</h4>
                  <p className="text-sm text-[#5C4033]">
                    The concentrated juice is set into molds, cooled naturally, and packaged with care to maintain freshness.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
