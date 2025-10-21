import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  HelpCircle, 
  BookOpen,
  Video,
  Mail,
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles
} from 'lucide-react';

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: "How do I report a road issue?",
      answer: "Click on 'Report Issue' in the sidebar, then follow the 5-step process: select location, choose category, upload photos, add description, and review before submitting."
    },
    {
      question: "How long does it take to get a response?",
      answer: "Most reports are acknowledged within 24-48 hours. Complex issues may take longer to resolve, but you'll receive status updates throughout the process."
    },
    {
      question: "Can I track my submitted reports?",
      answer: "Yes! Go to 'My Reports' to see all your submissions, their current status, and any updates from officials."
    },
    {
      question: "What types of issues can I report?",
      answer: "You can report potholes, cracks, flooding, damaged signage, street lighting issues, and other road infrastructure problems."
    },
    {
      question: "How do I upload photos?",
      answer: "During the report submission process, you'll reach the photo upload step where you can select 1-5 images from your device."
    },
    {
      question: "What if my issue isn't resolved?",
      answer: "If your issue remains unresolved for an extended period, you can add comments to your report or contact support for escalation."
    },
    {
      question: "How do I change notification settings?",
      answer: "Go to Profile & Settings, then scroll to Notification Preferences where you can customize email, SMS, and in-app notifications."
    },
    {
      question: "Can I see issues reported by others?",
      answer: "Yes! Visit the Interactive Map to view all community-reported issues in your area."
    }
  ];

  const guides = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of using RoadSense.ai",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "How to Report Issues",
      description: "Step-by-step guide to submitting reports",
      icon: BookOpen,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Video Tutorials",
      description: "Watch video guides and walkthroughs",
      icon: Video,
      color: "from-green-500 to-green-600"
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <HelpCircle size={32} />
            <h1 className="text-3xl font-bold">Help Center</h1>
          </div>
          <p className="text-orange-100 text-lg">
            Find answers and get the support you need
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search for help articles, FAQs, and guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 text-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guides.map((guide, index) => {
          const Icon = guide.icon;
          return (
            <Card key={index} className="p-8 border-0 shadow-lg hover:shadow-xl transition-all group cursor-pointer">
              <div className={`bg-gradient-to-br ${guide.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <Icon className="text-white" size={32} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {guide.title}
              </h3>
              <p className="text-sm text-gray-600">{guide.description}</p>
            </Card>
          );
        })}
      </div>

      {/* FAQs */}
      <Card className="p-8 border-0 shadow-xl">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl mr-3">
            <Sparkles className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-2">No matching questions found</p>
            <p className="text-sm text-gray-500">Try different keywords or browse all FAQs</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 transition-colors">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <div className="flex-shrink-0">
                    {expandedFaq === index ? (
                      <ChevronUp className="text-blue-600" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-600" size={20} />
                    )}
                  </div>
                </button>
                
                {expandedFaq === index && (
                  <div className="px-5 pb-5 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Contact Support */}
      <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Support</h2>
        <p className="text-gray-700 mb-6">
          Can't find what you're looking for? Our support team is here to help!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Mail className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Email</p>
              <p className="text-sm text-gray-600">support@RoadSense.ai</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
            <div className="bg-green-100 p-3 rounded-xl">
              <Phone className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Phone</p>
              <p className="text-sm text-gray-600">1800-123-4567</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
            <div className="bg-purple-100 p-3 rounded-xl">
              <MessageCircle className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Live Chat</p>
              <p className="text-sm text-gray-600">Available 9 AM - 6 PM</p>
            </div>
          </div>
        </div>

        <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
          <MessageCircle className="mr-2" size={18} />
          Start Live Chat
        </Button>
      </Card>

      {/* Submit Ticket */}
      <Card className="p-8 border-0 shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit a Support Ticket</h2>
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">Subject</label>
            <Input 
              placeholder="Brief description of your issue" 
              className="border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">Message</label>
            <Textarea 
              placeholder="Describe your issue in detail..."
              rows={6}
              className="border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            <Send className="mr-2" size={18} />
            Submit Ticket
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default HelpCenterPage;
