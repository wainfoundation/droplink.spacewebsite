import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Plus, 
  Settings,
  Link as LinkIcon
} from 'lucide-react';

interface EmptyProfileStateProps {
  username: string;
  onEditProfile?: () => void;
}

const EmptyProfileState: React.FC<EmptyProfileStateProps> = ({
  username,
  onEditProfile
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            @{username}
          </h2>
          
          <p className="text-gray-600 mb-6">
            This profile hasn't been set up yet. 
            <br />
            No links or information have been added.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={onEditProfile}
              className="w-full"
            >
              <Settings className="w-4 h-4 mr-2" />
              Set Up Profile
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Add Your First Link
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-6">
            Once you add content, your profile will be visible here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyProfileState;
