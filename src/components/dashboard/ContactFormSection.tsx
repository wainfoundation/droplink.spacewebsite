import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Trash2, 
  MessageCircle, 
  Mail,
  Phone,
  Calendar,
  User,
  Building2,
  MapPin,
  Globe,
  Send,
  Eye,
  EyeOff,
  Copy,
  Check,
  X,
  Save,
  Settings,
  Bell,
  BellOff,
  Star,
  Heart,
  ThumbsUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Download,
  Upload,
  ExternalLink,
  Link as LinkIcon,
  FileText,
  Image,
  Video,
  Music,
  BookOpen,
  Code,
  Palette,
  Briefcase,
  Award,
  Target,
  Zap,
  Crown,
  Gift,
  ShoppingBag,
  Tag,
  Percent,
  DollarSign,
  TrendingUp,
  Users,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Pin,
  Star as StarIcon,
  ShoppingCart,
  CreditCard,
  Headphones,
  Database,
  Shield,
  Palette as PaletteIcon,
  MessageSquare,
  Reply,
  Forward,
  Archive,
  Flag,
  Bookmark,
  Share2,
  Lock,
  Unlock,
  Key,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalLow,
  SignalZero,
  SignalHigh,
  SignalMedium,
  SignalLow as SignalLowIcon,
  SignalZero as SignalZeroIcon,
  SignalHigh as SignalHighIcon,
  SignalMedium as SignalMediumIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactForm {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  isActive: boolean;
  submissions: number;
  createdAt: string;
  embedCode: string;
}

interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, string>;
  submittedAt: string;
  status: 'new' | 'read' | 'replied' | 'archived';
}

const ContactFormSection = () => {
  const { toast } = useToast();
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [editingForm, setEditingForm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'forms' | 'submissions'>('forms');
  const [selectedForm, setSelectedForm] = useState<string | null>(null);

  // Mock data
  const [forms, setForms] = useState<ContactForm[]>([
    {
      id: '1',
      name: 'General Contact',
      description: 'General inquiries and contact form',
      fields: [
        { id: '1', type: 'text', label: 'Name', placeholder: 'Your full name', required: true },
        { id: '2', type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
        { id: '3', type: 'textarea', label: 'Message', placeholder: 'Your message...', required: true }
      ],
      isActive: true,
      submissions: 45,
      createdAt: '2024-01-15',
      embedCode: '<iframe src="https://droplink.space/contact/1" width="100%" height="400"></iframe>'
    },
    {
      id: '2',
      name: 'Business Inquiry',
      description: 'Professional business inquiries and partnerships',
      fields: [
        { id: '1', type: 'text', label: 'Company Name', placeholder: 'Your company', required: true },
        { id: '2', type: 'text', label: 'Contact Person', placeholder: 'Your name', required: true },
        { id: '3', type: 'email', label: 'Email', placeholder: 'business@company.com', required: true },
        { id: '4', type: 'phone', label: 'Phone', placeholder: '+1 (555) 123-4567', required: false },
        { id: '5', type: 'select', label: 'Inquiry Type', options: ['Partnership', 'Consulting', 'Hiring', 'Other'], required: true },
        { id: '6', type: 'textarea', label: 'Project Details', placeholder: 'Tell us about your project...', required: true }
      ],
      isActive: true,
      submissions: 23,
      createdAt: '2024-01-10',
      embedCode: '<iframe src="https://droplink.space/contact/2" width="100%" height="500"></iframe>'
    }
  ]);

  const [submissions, setSubmissions] = useState<FormSubmission[]>([
    {
      id: '1',
      formId: '1',
      data: {
        'Name': 'John Doe',
        'Email': 'john@example.com',
        'Message': 'I would like to discuss a potential collaboration.'
      },
      submittedAt: '2024-01-20T10:30:00Z',
      status: 'new'
    },
    {
      id: '2',
      formId: '2',
      data: {
        'Company Name': 'Tech Corp',
        'Contact Person': 'Jane Smith',
        'Email': 'jane@techcorp.com',
        'Phone': '+1 (555) 123-4567',
        'Inquiry Type': 'Partnership',
        'Project Details': 'We are interested in partnering for our new product launch.'
      },
      submittedAt: '2024-01-19T14:15:00Z',
      status: 'read'
    }
  ]);

  const [newForm, setNewForm] = useState({
    name: '',
    description: '',
    fields: [] as FormField[]
  });

  const fieldTypes = [
    { value: 'text', label: 'Text Input', icon: <FileText className="h-4 w-4" /> },
    { value: 'email', label: 'Email', icon: <Mail className="h-4 w-4" /> },
    { value: 'phone', label: 'Phone', icon: <Phone className="h-4 w-4" /> },
    { value: 'textarea', label: 'Text Area', icon: <MessageSquare className="h-4 w-4" /> },
    { value: 'select', label: 'Dropdown', icon: <Settings className="h-4 w-4" /> },
    { value: 'checkbox', label: 'Checkbox', icon: <CheckCircle className="h-4 w-4" /> },
    { value: 'radio', label: 'Radio Button', icon: <Target className="h-4 w-4" /> }
  ];

  const handleCreateForm = () => {
    if (!newForm.name.trim()) {
      toast({
        title: "Form Name Required",
        description: "Please enter a name for your contact form",
        variant: "destructive"
      });
      return;
    }

    const form: ContactForm = {
      id: Date.now().toString(),
      ...newForm,
      isActive: true,
      submissions: 0,
      createdAt: new Date().toISOString(),
      embedCode: `<iframe src="https://droplink.space/contact/${Date.now()}" width="100%" height="400"></iframe>`
    };

    setForms([form, ...forms]);
    setNewForm({
      name: '',
      description: '',
      fields: []
    });
    setIsCreatingForm(false);

    toast({
      title: "Contact Form Created",
      description: "Your contact form has been created successfully"
    });
  };

  const handleAddField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: 'text',
      label: '',
      placeholder: '',
      required: false
    };

    setNewForm({
      ...newForm,
      fields: [...newForm.fields, newField]
    });
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    setNewForm({
      ...newForm,
      fields: newForm.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    });
  };

  const handleRemoveField = (fieldId: string) => {
    setNewForm({
      ...newForm,
      fields: newForm.fields.filter(field => field.id !== fieldId)
    });
  };

  const handleDeleteForm = (id: string) => {
    setForms(forms.filter(form => form.id !== id));
    toast({
      title: "Form Deleted",
      description: "Contact form has been removed"
    });
  };

  const handleToggleFormStatus = (id: string) => {
    setForms(forms.map(form => 
      form.id === id ? { ...form, isActive: !form.isActive } : form
    ));
  };

  const copyEmbedCode = async (embedCode: string) => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast({
        title: "Embed Code Copied",
        description: "The embed code has been copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy embed code",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: FormSubmission['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-gray-100 text-gray-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalSubmissions = submissions.length;
  const newSubmissions = submissions.filter(s => s.status === 'new').length;
  const repliedSubmissions = submissions.filter(s => s.status === 'replied').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Forms</h2>
          <p className="text-gray-600">Manage contact forms and view submissions</p>
        </div>
        <Button
          onClick={() => setIsCreatingForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Form
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Submissions</p>
                <p className="text-2xl font-bold text-blue-900">{totalSubmissions}</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +8 this week
                </div>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">New Messages</p>
                <p className="text-2xl font-bold text-green-900">{newSubmissions}</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <Clock className="h-4 w-4" />
                  Unread
                </div>
              </div>
              <Bell className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Replied</p>
                <p className="text-2xl font-bold text-purple-900">{repliedSubmissions}</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {Math.round((repliedSubmissions / totalSubmissions) * 100)}% response rate
                </div>
              </div>
              <Reply className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'forms' | 'submissions')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forms">Contact Forms</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        {/* Forms Tab */}
        <TabsContent value="forms" className="space-y-6">
          {/* Create Form */}
          {isCreatingForm && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Contact Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="formName">Form Name</Label>
                    <Input
                      id="formName"
                      value={newForm.name}
                      onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                      placeholder="e.g., General Contact"
                    />
                  </div>
                  <div>
                    <Label htmlFor="formDescription">Description</Label>
                    <Input
                      id="formDescription"
                      value={newForm.description}
                      onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                      placeholder="Brief description of the form"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Form Fields</Label>
                    <Button onClick={handleAddField} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {newForm.fields.map((field, index) => (
                      <Card key={field.id}>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <Label>Field Type</Label>
                              <select
                                value={field.type}
                                onChange={(e) => handleUpdateField(field.id, { type: e.target.value as FormField['type'] })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {fieldTypes.map(type => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <Label>Label</Label>
                              <Input
                                value={field.label}
                                onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                                placeholder="Field label"
                              />
                            </div>
                            <div>
                              <Label>Placeholder</Label>
                              <Input
                                value={field.placeholder || ''}
                                onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                                placeholder="Placeholder text"
                              />
                            </div>
                            <div className="flex items-end gap-2">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`required-${field.id}`}
                                  checked={field.required}
                                  onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                                  className="mr-2"
                                />
                                <Label htmlFor={`required-${field.id}`}>Required</Label>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemoveField(field.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button onClick={handleCreateForm}>
                    <Save className="h-4 w-4 mr-2" />
                    Create Form
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreatingForm(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Forms List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {forms.map((form) => (
              <Card key={form.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {form.name}
                        {form.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{form.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleFormStatus(form.id)}
                      >
                        {form.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteForm(form.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Fields: {form.fields.length}</span>
                      <span className="text-gray-600">Submissions: {form.submissions}</span>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Embed Code</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={form.embedCode}
                          readOnly
                          className="text-xs font-mono"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyEmbedCode(form.embedCode)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-6">
          <div className="space-y-4">
            {submissions.map((submission) => {
              const form = forms.find(f => f.id === submission.formId);
              return (
                <Card key={submission.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{form?.name}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(submission.submittedAt).toLocaleDateString()} at{' '}
                          {new Date(submission.submittedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {Object.entries(submission.data).map(([key, value]) => (
                        <div key={key} className="flex">
                          <span className="font-medium text-gray-700 w-32">{key}:</span>
                          <span className="text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm">
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                      <Button size="sm" variant="outline">
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactFormSection;
