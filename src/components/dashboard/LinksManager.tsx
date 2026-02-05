import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Link as LinkIcon, 
  Eye, 
  MousePointer,
  GripVertical,
  Save,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  clicks: number;
  views: number;
  position: number;
  createdAt: string;
  updatedAt: string;
}

interface LinksManagerProps {
  userPlan: string;
  onUpgrade?: (planId: string) => void;
}

const LinksManager = ({ userPlan, onUpgrade }: LinksManagerProps) => {
  const { toast } = useToast();
  const [links, setLinks] = useState<Link[]>([]);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    description: "",
    icon: "🌐"
  });

  const maxLinks = userPlan === 'free' ? 1 : userPlan === 'starter' ? 10 : 999;

  useEffect(() => {
    // Load links from localStorage or API
    const savedLinks = localStorage.getItem('user_links');
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }
  }, []);

  const saveLinks = (updatedLinks: Link[]) => {
    setLinks(updatedLinks);
    localStorage.setItem('user_links', JSON.stringify(updatedLinks));
  };

  const handleAddLink = () => {
    if (links.length >= maxLinks) {
      toast({
        title: "Link Limit Reached",
        description: `Upgrade your plan to add more links. Current limit: ${maxLinks}`,
        variant: "destructive",
      });
      return;
    }

    if (!newLink.title || !newLink.url) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and URL",
        variant: "destructive",
      });
      return;
    }

    const link: Link = {
      id: `link_${Date.now()}`,
      title: newLink.title,
      url: newLink.url,
      description: newLink.description,
      icon: newLink.icon,
      isActive: true,
      clicks: 0,
      views: 0,
      position: links.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedLinks = [...links, link];
    saveLinks(updatedLinks);
    
    setNewLink({ title: "", url: "", description: "", icon: "🌐" });
    setIsAddingLink(false);
    
    toast({
      title: "Link Added",
      description: "Your link has been added successfully",
    });
  };

  const handleEditLink = (id: string) => {
    const link = links.find(l => l.id === id);
    if (link) {
      setNewLink({
        title: link.title,
        url: link.url,
        description: link.description || "",
        icon: link.icon || "🌐"
      });
      setEditingLink(id);
      setIsAddingLink(true);
    }
  };

  const handleUpdateLink = () => {
    if (!editingLink) return;

    const updatedLinks = links.map(link => 
      link.id === editingLink 
        ? { 
            ...link, 
            title: newLink.title,
            url: newLink.url,
            description: newLink.description,
            icon: newLink.icon,
            updatedAt: new Date().toISOString()
          }
        : link
    );

    saveLinks(updatedLinks);
    setEditingLink(null);
    setNewLink({ title: "", url: "", description: "", icon: "🌐" });
    setIsAddingLink(false);
    
    toast({
      title: "Link Updated",
      description: "Your link has been updated successfully",
    });
  };

  const handleDeleteLink = (id: string) => {
    const updatedLinks = links.filter(link => link.id !== id);
    saveLinks(updatedLinks);
    
    toast({
      title: "Link Deleted",
      description: "Your link has been deleted successfully",
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index
    }));

    saveLinks(updatedItems);
  };

  const toggleLinkStatus = (id: string) => {
    const updatedLinks = links.map(link => 
      link.id === id 
        ? { ...link, isActive: !link.isActive }
        : link
    );
    saveLinks(updatedLinks);
  };

  const getIconOptions = () => [
    "🌐", "📱", "💼", "🎵", "📷", "📺", "🛒", "📚", "🎮", "🏠",
    "📧", "💬", "📞", "📍", "🎨", "🏃", "🍕", "☕", "🎪", "🌟"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Links</h2>
          <p className="text-gray-600">
            {links.length} of {maxLinks} links used
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {userPlan === 'free' && (
            <Button
              onClick={() => onUpgrade?.('starter')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Upgrade Plan
            </Button>
          )}
          <Button
            onClick={() => setIsAddingLink(true)}
            disabled={links.length >= maxLinks}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>
      </div>

      {/* Add/Edit Link Form */}
      {isAddingLink && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingLink ? "Edit Link" : "Add New Link"}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingLink(false);
                  setEditingLink(null);
                  setNewLink({ title: "", url: "", description: "", icon: "🌐" });
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-10 gap-2">
                  {getIconOptions().map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewLink({ ...newLink, icon })}
                      className={`w-8 h-8 rounded border-2 text-center transition-colors ${
                        newLink.icon === icon
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <Input
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  placeholder="My Website"
                  maxLength={50}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL *
              </label>
              <Input
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://example.com"
                type="url"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <Textarea
                value={newLink.description}
                onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                placeholder="Brief description of this link"
                maxLength={200}
                rows={2}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingLink(false);
                  setEditingLink(null);
                  setNewLink({ title: "", url: "", description: "", icon: "🌐" });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingLink ? handleUpdateLink : handleAddLink}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingLink ? "Update Link" : "Add Link"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Links List */}
      {links.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No links yet</h3>
            <p className="text-gray-600 mb-4">
              Start building your link-in-bio page by adding your first link
            </p>
            <Button
              onClick={() => setIsAddingLink(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Link
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {links.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-3">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{link.icon}</span>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate">
                                  {link.title}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">
                                  {link.url}
                                </p>
                                {link.description && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {link.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 mt-3">
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Eye className="w-4 h-4" />
                                <span>{link.views}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <MousePointer className="w-4 h-4" />
                                <span>{link.clicks}</span>
                              </div>
                              <Badge
                                variant={link.isActive ? "default" : "secondary"}
                                className="cursor-pointer"
                                onClick={() => toggleLinkStatus(link.id)}
                              >
                                {link.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditLink(link.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLink(link.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Plan Upgrade Notice */}
      {userPlan === 'free' && links.length > 0 && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">Upgrade to Add More Links</h3>
                <p className="text-sm text-blue-700">
                  Free plan allows only 1 link. Upgrade to add unlimited links!
                </p>
              </div>
              <Button
                onClick={() => onUpgrade?.('starter')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LinksManager;
