
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ExternalLink, ArrowUp, ArrowDown, Eye, EyeOff, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLinks } from "@/hooks/useLinks";

interface LinkItemProps {
  link: {
    id: string;
    title: string;
    url: string;
    icon: string;
    clicks: number;
    is_active: boolean;
    position: number;
  };
  onEdit: (linkId: string) => void;
  onDeleted: () => void;
  onReorder: (direction: 'up' | 'down', linkId: string, currentPosition: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

const LinkItem = ({ link, onEdit, onDeleted, onReorder, isFirst, isLast }: LinkItemProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { updateLink, deleteLink, trackLinkClick } = useLinks(link.user_id);

  const handleToggleActive = async () => {
    setIsUpdating(true);
    
    try {
      await updateLink(link.id, { is_active: !link.is_active });
    } catch (error) {
      console.error("Error toggling link status:", error);
      toast({
        title: "Error",
        description: "Failed to update link status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this link? This action cannot be undone.")) {
      setIsUpdating(true);
      
      try {
        await deleteLink(link.id);
        onDeleted();
      } catch (error) {
        console.error("Error deleting link:", error);
        toast({
          title: "Error",
          description: "Failed to delete link. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const visitLink = async () => {
    try {
      await trackLinkClick(link.id);
      window.open(link.url, '_blank');
    } catch (error) {
      console.error("Error tracking link click:", error);
      // Still open the link even if tracking fails
      window.open(link.url, '_blank');
    }
  };

  const getClickColor = (clicks: number) => {
    if (clicks > 1000) return "text-green-600";
    if (clicks > 500) return "text-blue-600";
    if (clicks > 100) return "text-yellow-600";
    return "text-gray-500";
  };

  return (
    <Card className="p-4 transition-all hover:shadow-md border-l-4 border-l-transparent hover:border-l-primary">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{link.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900">{link.title}</h3>
            <p className="text-sm text-gray-500 truncate max-w-[200px]">{link.url}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                <BarChart3 className="w-3 h-3 mr-1" />
                {link.clicks} clicks
              </Badge>
              {link.clicks > 100 && (
                <Badge variant="outline" className={`text-xs ${getClickColor(link.clicks)}`}>
                  {link.clicks > 1000 ? '🔥 Hot' : link.clicks > 500 ? '📈 Growing' : '👍 Good'}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={visitLink} 
            title="Visit link"
            className="hover:bg-green-50 hover:text-green-600"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(link.id)} 
            title="Edit link"
            className="hover:bg-blue-50 hover:text-blue-600"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete} 
            title="Delete link"
            className="hover:bg-red-50 hover:text-red-600"
            disabled={isUpdating}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-3 pt-3 border-t">
        <div className="flex items-center gap-2">
          <Switch
            checked={link.is_active}
            onCheckedChange={handleToggleActive}
            disabled={isUpdating}
          />
          <span className="text-sm text-gray-500 flex items-center gap-1">
            {link.is_active ? (
              <>
                <Eye className="w-4 h-4 text-green-600" />
                Visible on profile
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 text-gray-400" />
                Hidden from profile
              </>
            )}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onReorder('up', link.id, link.position)}
            disabled={isFirst || isUpdating}
            title="Move up"
            className="hover:bg-gray-50"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onReorder('down', link.id, link.position)}
            disabled={isLast || isUpdating}
            title="Move down"
            className="hover:bg-gray-50"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default LinkItem;
