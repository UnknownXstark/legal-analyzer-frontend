import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { mockDocuments } from "@/utils/mockDocuments";
import AppLayout from "@/layouts/AppLayout";

const UploadDocument = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a document title");
      return;
    }

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);

    try {
      await mockDocuments.addDocument({
        title: title.trim(),
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      toast.success("Document uploaded successfully!");
      navigate("/documents");
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Upload Document
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload a legal document for AI-powered analysis
          </p>
        </div>

        <Card className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
            <CardDescription>
              Accepted formats: PDF, DOCX, TXT (Max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Non-Disclosure Agreement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isUploading}
                  className="transition-all focus:shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Select File *</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <label
                    htmlFor="file"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    {file ? (
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="w-4 h-4" />
                          <span className="truncate max-w-[200px] font-medium">
                            {file.name}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <p className="text-sm font-medium text-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, DOCX, TXT up to 10MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="gap-2 flex-1 sm:flex-none hover:shadow-md transition-all"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Document
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/documents")}
                  disabled={isUploading}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default UploadDocument;
