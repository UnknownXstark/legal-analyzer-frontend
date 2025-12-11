import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Share2 } from 'lucide-react';
import { lawyerClientAPI, Client } from '@/api/lawyerClient';
import { documentSharingAPI } from '@/api/documentSharing';
import { toast } from 'sonner';

interface ShareDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  documentTitle: string;
}

const ShareDocumentModal = ({
  open,
  onOpenChange,
  documentId,
  documentTitle,
}: ShareDocumentModalProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (open) {
      loadClients();
    }
  }, [open]);

  const loadClients = async () => {
    setIsLoading(true);
    const { data, error } = await lawyerClientAPI.getLawyerClients();
    if (error) {
      toast.error(error);
    } else if (data) {
      setClients(data);
    }
    setIsLoading(false);
  };

  const handleShare = async () => {
    if (!selectedClient) {
      toast.error('Please select a client');
      return;
    }

    setIsSharing(true);
    const { error } = await documentSharingAPI.shareDocument(
      parseInt(documentId),
      parseInt(selectedClient)
    );

    if (error) {
      toast.error(error);
    } else {
      toast.success('Document shared successfully');
      onOpenChange(false);
      setSelectedClient('');
    }
    setIsSharing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Share2 className="w-5 h-5" />
            Share Document
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Share "{documentTitle}" with one of your clients.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : clients.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No clients available. Assign clients first.
            </p>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Select Client
              </label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="w-full bg-background border-input">
                  <SelectValue placeholder="Choose a client" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border z-50">
                {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.username} ({client.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSharing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleShare}
            disabled={isSharing || !selectedClient || clients.length === 0}
            className="gap-2"
          >
            {isSharing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDocumentModal;
