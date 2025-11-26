import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Heart, Users, Shield } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Award,
      title: 'Expert Care',
      description: 'Experienced dental professionals with years of expertise'
    },
    {
      icon: Heart,
      title: 'Patient First',
      description: 'Your comfort and satisfaction is our top priority'
    },
    {
      icon: Users,
      title: 'Community Trust',
      description: 'Serving Bangalore with dedication and care'
    },
    {
      icon: Shield,
      title: 'Safe & Hygienic',
      description: 'State-of-the-art sterilization and safety protocols'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Advik Dento Care</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted dental care partner in Bangalore
          </p>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <img
                    src="/images/name.png"
                    alt="Advik Dento Care Team"
                    className="rounded-lg shadow-lg w-full h-full object-cover max-h-96"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Advik Dento Care was founded with a vision to provide world-class dental services 
                    to the people of Bangalore. We combine modern technology with compassionate 
                    care to ensure every patient receives the best treatment possible.
                  </p>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Our team of experienced dentists specializes in various fields of dentistry, 
                    from routine cleanings to complex procedures. We believe in preventive care 
                    and patient education to help you maintain optimal oral health.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    With state-of-the-art facilities and a patient-first approach, we've become 
                    one of Bangalore's most trusted dental care providers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
