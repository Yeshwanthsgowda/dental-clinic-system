import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Stethoscope, 
  Calendar, 
  Shield, 
  Clock,
  Star,
  Users,
  Award,
  Heart,
  CheckCircle,
  ArrowRight,
  Play
} from 'lucide-react';

const Home = () => {
  const { role } = useAuth();
  
  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Schedule appointments with your preferred doctors in just a few clicks.'
    },
    {
      icon: Stethoscope,
      title: 'Expert Doctors',
      description: 'Access to qualified and experienced dental professionals.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your medical information is protected with enterprise-grade security.'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your queries.'
    }
  ];

  const stats = [
    { number: '2000+', label: 'Happy Patients' },
    { number: '30+', label: 'Expert Doctors' },
    { number: '5000+', label: 'Appointments' },
    { number: '4.8', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Your Smile is Our
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}Priority
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Book appointments with top dental professionals, manage your treatments, 
                and maintain your oral health with our comprehensive dental care platform.
              </p>
              {role !== 'doctor' && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link to="/ai-book-appointment">Book Appointment</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/doctors">Find Doctors</Link>
                  </Button>
                </div>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Stethoscope className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Dr. Smith</h3>
                      <p className="text-gray-600">Lead Dentist</p>
                    </div>
                  </div>
                  <div className="border-l-4 border-blue-600 pl-4 py-2 mb-4">
                    <p className="text-sm text-gray-700 italic">
                      "A smile is the prettiest thing you can wear. Let us help you wear it with confidence."
                    </p>
                  </div>
                  <Button className="w-full" size="sm" asChild>
                    <Link to="/ai-book-appointment">Book Appointment</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Dental Care Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive dental care solutions with modern technology 
              and experienced professionals to ensure your comfort and satisfaction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">Our Services</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Dental Care
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From routine cleanings to advanced procedures, we offer complete dental solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'General Dentistry', icon: Stethoscope, desc: 'Routine checkups and preventive care' },
              { name: 'Cosmetic Dentistry', icon: Star, desc: 'Enhance your smile with modern techniques' },
              { name: 'Orthodontics', icon: Award, desc: 'Straighten teeth with braces and aligners' },
              { name: 'Oral Surgery', icon: Shield, desc: 'Advanced surgical procedures' },
              { name: 'Emergency Care', icon: Clock, desc: '24/7 emergency dental services' },
              { name: 'Pediatric Dentistry', icon: Heart, desc: 'Specialized care for children' }
            ].map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <service.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{service.name}</h3>
                    <p className="text-gray-600">{service.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', rating: 5, text: 'Exceptional care and modern facilities. The staff is incredibly professional and caring.' },
              { name: 'Michael Chen', rating: 5, text: 'Best dental experience I\'ve ever had. The online booking system is so convenient!' },
              { name: 'Emily Davis', rating: 5, text: 'Dr. Smith transformed my smile completely. I couldn\'t be happier with the results.' }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">Verified Patient</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinic Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              State-of-the-Art Facilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience world-class dental care with our advanced technology
            </p>
          </motion.div>

          {/* Machine 1 - Left Image, Right Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20"
          >
            <div className="order-2 md:order-1">
              <img
                src="/images/machine1.png"
                alt="Advanced Dental Equipment"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Advanced Diagnostic Technology
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our clinic is equipped with the latest digital imaging and diagnostic tools 
                that ensure accurate diagnosis and effective treatment planning.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From 3D imaging to intraoral cameras, we use cutting-edge technology to 
                provide you with the best possible care and treatment outcomes.
              </p>
            </div>
          </motion.div>

          {/* Machine 2 - Left Text, Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Precision Treatment Equipment
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We utilize state-of-the-art treatment equipment that ensures precision, 
                comfort, and faster recovery times for all our patients.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our modern dental chairs and instruments are designed with patient comfort 
                in mind, making your visit as pleasant and stress-free as possible.
              </p>
            </div>
            <div>
              <img
                src="/images/machine2.png"
                alt="Modern Treatment Equipment"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30">Get Started Today</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Your Perfect Smile Awaits
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of satisfied patients who trust us with their dental care. 
              Book your appointment today and experience the difference.
            </p>
            {role !== 'doctor' && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg" asChild>
                  <Link to="/ai-book-appointment">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Appointment
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20 backdrop-blur-sm" asChild>
                  <Link to="/doctors">
                    Browse Doctors
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;