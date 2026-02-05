import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GoToTop from '@/components/GoToTop';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, FileText, Mail, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ReportAbuse = () => {
  const [formData, setFormData] = useState({
    reportType: '',
    email: '',
    username: '',
    description: '',
    url: '',
    evidence: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportTypes = [
    { value: 'harassment', label: 'Harassment or Bullying' },
    { value: 'hate-speech', label: 'Hate Speech or Discrimination' },
    { value: 'spam', label: 'Spam or Scam' },
    { value: 'misinformation', label: 'Misinformation or False Information' },
    { value: 'sexual-abuse', label: 'Sexual Harassment or Abuse' },
    { value: 'violence', label: 'Threats or Violence' },
    { value: 'doxxing', label: 'Doxxing or Privacy Violation' },
    { value: 'illegal', label: 'Illegal Content' },
    { value: 'copyright', label: 'Copyright or IP Violation' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reportType || !formData.email || !formData.description) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields (marked with *).',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here you would normally send this to your backend
      console.log('Abuse report submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Report Submitted',
        description: 'Thank you for reporting. Our team will review your report within 24 hours.',
      });
      
      // Reset form
      setFormData({
        reportType: '',
        email: '',
        username: '',
        description: '',
        url: '',
        evidence: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit report. Please try again or email us directly.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Report Abuse - Droplink</title>
        <meta name="description" content="Report abuse, harassment, or policy violations on Droplink." />
      </Helmet>
      <Navbar />
      <GoToTop />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-red-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <AlertTriangle className="w-12 h-12 text-red-600 mr-4" />
                <h1 className="text-4xl font-bold text-gray-900">Report Abuse</h1>
              </div>
              
              <p className="text-center text-gray-600 mb-8 text-lg">
                Help us keep Droplink safe for everyone
              </p>

              <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
                <p className="text-red-900 font-medium">
                  We take all reports seriously. Your report is confidential and will be reviewed by our 
                  Trust & Safety team within 24 hours. If you witness illegal activity, please also contact 
                  local law enforcement.
                </p>
              </div>

              {/* Two Column Layout */}
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {/* Left Column - Important Info */}
                <div className="md:col-span-1">
                  <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-6 mb-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-600" />
                      Response Time
                    </h3>
                    <p className="text-gray-700 text-sm">
                      We review reports within 24 hours. Urgent cases are prioritized.
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-6 mb-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Confidentiality
                    </h3>
                    <p className="text-gray-700 text-sm">
                      Your identity remains confidential unless required by law.
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-purple-600" />
                      Evidence
                    </h3>
                    <p className="text-gray-700 text-sm">
                      Provide screenshots or links to help us investigate. This is optional but helpful.
                    </p>
                  </div>
                </div>

                {/* Right Column - Form */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm border p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Report Type */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          What are you reporting? *
                        </label>
                        <select
                          name="reportType"
                          value={formData.reportType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                          required
                        >
                          <option value="">Select a report type...</option>
                          {reportTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Your Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          We'll only contact you about this report
                        </p>
                      </div>

                      {/* Username Being Reported */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Username or Account Being Reported
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="@username"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      {/* URL */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Link to Reported Content
                        </label>
                        <input
                          type="url"
                          name="url"
                          value={formData.url}
                          onChange={handleChange}
                          placeholder="https://..."
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Provide a direct link if possible
                        </p>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Description of the Abuse *
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Please describe what happened, when it happened, and why you believe it violates our policies..."
                          rows={5}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Be as detailed as possible to help us investigate
                        </p>
                      </div>

                      {/* Evidence */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Evidence (Screenshots, Links, etc.)
                        </label>
                        <textarea
                          name="evidence"
                          value={formData.evidence}
                          onChange={handleChange}
                          placeholder="Paste screenshots, links, or other evidence here. You can also describe how to find the content..."
                          rows={4}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Optional but helpful for investigation
                        </p>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                      >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        By submitting this report, you agree to our Report Guidelines and Privacy Policy
                      </p>
                    </form>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-sm border p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h2>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold text-sm">1</div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Review</h3>
                        <p className="text-gray-700 text-sm">Our team reviews your report and gathers evidence</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold text-sm">2</div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Investigation</h3>
                        <p className="text-gray-700 text-sm">We investigate the reported behavior thoroughly</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold text-sm">3</div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Action</h3>
                        <p className="text-gray-700 text-sm">If violations are found, appropriate action is taken</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-bold text-sm">4</div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Follow-up</h3>
                        <p className="text-gray-700 text-sm">We'll notify you of the outcome (if appropriate)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Need More Help?</h2>
                  
                  <p className="text-gray-700 mb-6">
                    If you need immediate assistance or want to contact our Trust & Safety team directly:
                  </p>
                  
                  <div className="space-y-4">
                    <a href="mailto:safety@droplink.space" className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all border border-blue-200">
                      <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-blue-900">Email Safety Team</h3>
                        <p className="text-sm text-blue-700">safety@droplink.space</p>
                      </div>
                    </a>
                    
                    <a href="mailto:legal@droplink.space" className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all border border-purple-200">
                      <Mail className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-purple-900">Legal Inquiries</h3>
                        <p className="text-sm text-purple-700">legal@droplink.space</p>
                      </div>
                    </a>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-900">
                      <strong>For Emergencies:</strong> If someone is in immediate danger, please contact local law enforcement immediately.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center text-gray-600 text-sm mt-8">
                <p>See our <a href="/community-guidelines" className="text-primary hover:underline">Community Guidelines</a> for more information</p>
                <p className="mt-2">Last updated: December 7, 2025</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ReportAbuse;
