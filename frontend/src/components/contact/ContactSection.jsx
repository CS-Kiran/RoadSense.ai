// src/components/contact/ContactSection.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    // Reset success message after 3 seconds
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "support@RoadSense.ai",
      subtext: "Response within 24 hours",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 20 1234 5678",
      subtext: "Mon-Fri, 9AM-6PM IST",
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Pune, Maharashtra",
      subtext: "India 411001",
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "9:00 AM - 6:00 PM",
      subtext: "Monday to Friday",
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Information Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-600 border-blue-200 px-4 py-2">
              Contact Information
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Preferred Channel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're available through multiple channels to assist you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    {/* Icon */}
                    <div className={`${info.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                      <Icon className={info.iconColor} size={24} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {info.title}
                    </h3>

                    {/* Details */}
                    <p className="text-gray-900 font-semibold mb-1">
                      {info.details}
                    </p>
                    <p className="text-sm text-gray-600">
                      {info.subtext}
                    </p>

                    {/* Bottom Accent */}
                    <div className={`mt-4 h-1 bg-gradient-to-r ${info.gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="p-8 border-0 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Send Us a Message
              </h2>
              <p className="text-gray-600 mb-6">
                Fill out the form below and we'll get back to you as soon as possible
              </p>

              {/* Success Message */}
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3"
                >
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-green-700 font-medium">
                    Message sent successfully! We'll get back to you soon.
                  </span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Subject *
                  </label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Message *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    required
                    minLength={10}
                    className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 font-semibold py-6 text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  We typically respond within 24 hours during business days
                </p>
              </form>
            </Card>
          </motion.div>

          {/* Quick Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* FAQ Card */}
            <Card className="p-8 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <HelpCircle className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Need Quick Help?
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Check our FAQ section for instant answers to common questions about reporting issues, tracking status, and account management.
              </p>
              <Link to="/help">
                <Button variant="outline" className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold">
                  Visit FAQ
                </Button>
              </Link>
            </Card>

            {/* Response Time Card */}
            <Card className="p-6 border-0 shadow-lg">
              <h4 className="font-bold text-gray-900 mb-4">Average Response Times</h4>
              <div className="space-y-3">
                {[
                  { label: 'Email', time: '24 hours' },
                  { label: 'Phone', time: 'Immediate' },
                  { label: 'Contact Form', time: '1-2 days' },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700">{item.label}</span>
                    <Badge variant="outline" className="font-semibold">
                      {item.time}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}