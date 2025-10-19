import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageSquare, Clock, Send } from "lucide-react";

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
      details: "support@roadsense.ai",
      subtext: "Response within 24 hours",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 20 1234 5678",
      subtext: "Mon-Fri, 9AM-6PM IST",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Pune, Maharashtra",
      subtext: "India 411001",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "9:00 AM - 6:00 PM",
      subtext: "Monday to Friday",
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <section className="py-20 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Information Cards */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-3xl font-bold">Contact Information</h2>
              <p className="text-muted-foreground">
                Choose the best way to reach us. We're available through
                multiple channels to assist you.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                    <div
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${info.color}`}
                    >
                      <info.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold">{info.title}</h3>
                    <p className="mb-1 text-sm font-medium text-foreground">
                      {info.details}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {info.subtext}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Help Section */}
            <Card className="border-primary/20 bg-primary/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Need Quick Help?</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Check our FAQ section for instant answers to common
                    questions about reporting issues, tracking status, and
                    account management.
                  </p>
                  <Button variant="outline" size="sm">
                    Visit FAQ
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold">Send Us a Message</h2>

              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-800"
                >
                  ✓ Message sent successfully! We'll get back to you soon.
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Kiran Patil"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="kiran@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium"
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="resize-none"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Minimum 10 characters
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Sending...</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  We typically respond within 24 hours during business days
                </p>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
