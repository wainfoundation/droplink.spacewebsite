
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, X, Palette, Eye, EyeOff } from "lucide-react";
import { useLinks } from "@/hooks/useLinks";
import { useToast } from "@/hooks/use-toast";

interface LinkFormProps {
  linkId?: string;
  userId: string;
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: {
    title: string;
    url: string;
    icon?: string;
    is_active?: boolean;
  };
}

const LinkForm = ({ linkId, userId, onCancel, onSuccess, initialData }: LinkFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [icon, setIcon] = useState(initialData?.icon || "🔗");
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addLink, updateLink } = useLinks(userId);
  const isEditing = !!linkId;

  // Popular link templates
  const linkTemplates = [
    { title: "Instagram", url: "https://instagram.com/", icon: "📷" },
    { title: "YouTube", url: "https://youtube.com/@", icon: "🎥" },
    { title: "Twitter", url: "https://twitter.com/", icon: "🐦" },
    { title: "TikTok", url: "https://tiktok.com/@", icon: "🎵" },
    { title: "LinkedIn", url: "https://linkedin.com/in/", icon: "💼" },
    { title: "Website", url: "https://", icon: "🌐" },
    { title: "Email", url: "mailto:", icon: "📧" },
    { title: "WhatsApp", url: "https://wa.me/", icon: "💬" },
    { title: "Telegram", url: "https://t.me/", icon: "📱" },
    { title: "Discord", url: "https://discord.gg/", icon: "🎮" },
    { title: "Spotify", url: "https://open.spotify.com/", icon: "🎵" },
    { title: "Pinterest", url: "https://pinterest.com/", icon: "📌" }
  ];

  const emojiOptions = ["🔗", "💼", "📱", "💬", "📷", "🎮", "💰", "📝", "🎵", "📚", "🎬", "🏆", "⭐", "🎯", "🚀", "💎", "🎨", "📊", "🎪", "🌟"];

  const handleTemplateSelect = (template: typeof linkTemplates[0]) => {
    setTitle(template.title);
    setUrl(template.url);
    setIcon(template.icon);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in both title and URL",
        variant: "destructive",
      });
      return;
    }
    
    // If URL doesn't start with http:// or https://, add https://
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url) && !url.startsWith('mailto:')) {
      formattedUrl = `https://${url}`;
    }
    
    setIsLoading(true);
    
    try {
      if (isEditing) {
        await updateLink(linkId, {
          title,
          url: formattedUrl,
          icon,
          is_active: isActive
        });
      } else {
        await addLink({
          title,
          url: formattedUrl,
          icon
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving link:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} link. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-6 rounded-lg border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{isEditing ? "Edit Link" : "Add New Link"}</h3>
        <Button variant="ghost" size="icon" onClick={onCancel} type="button">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Quick Templates */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Quick Templates</Label>
        <div className="grid grid-cols-3 gap-2">
          {linkTemplates.map((template, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleTemplateSelect(template)}
              className="p-3 text-center border rounded-lg hover:bg-white hover:shadow-sm transition-all text-sm"
            >
              <div className="text-lg mb-1">{template.icon}</div>
              <div className="text-xs text-gray-600">{template.title}</div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Icon Selection */}
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <div className="flex gap-2 flex-wrap">
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setIcon(emoji)}
                className={`w-8 h-8 text-lg flex items-center justify-center rounded-md transition-all
                  ${emoji === icon ? 'bg-primary text-white scale-110' : 'bg-white border hover:bg-gray-50'}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter link title"
            required
          />
        </div>
        
        {/* URL */}
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL (e.g., example.com)"
            required
          />
        </div>

        {/* Active Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium">Link Status</Label>
            <p className="text-xs text-gray-500">
              {isActive ? "Visible on your profile" : "Hidden from your profile"}
            </p>
          </div>
          <Switch
            checked={isActive}
            onCheckedChange={setIsActive}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Save Changes" : "Add Link"}
        </Button>
      </div>
    </form>
  );
};

export default LinkForm;
