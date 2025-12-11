import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, Loader2, Brain, AlertTriangle, CheckCircle2, Info, MessageSquare, History, Share2 } from 'lucide-react';
import { useDocument } from '@/hooks/useDocuments';
import { useDocuments } from '@/hooks/useDocuments';
import AppLayout from '@/layouts/AppLayout';
import CommentSidebar from '@/components/collaboration/CommentSidebar';
import VersionList from '@/components/collaboration/VersionList';
import DocumentHighlights from '@/components/collaboration/DocumentHighlights';
import UpgradeLimitModal from '@/components/UpgradeLimitModal';
import ShareDocumentModal from '@/components/ShareDocumentModal';
import { getCurrentUser } from '@/lib/auth';
import { formatDate } from '@/utils/formatDate';

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { document, isLoading } = useDocument(id);
  const { analyzeDocumentAsync, isAnalyzing, generateReport, isGeneratingReport } = useDocuments();
  const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const user = getCurrentUser();
  const isLawyer = user?.role === 'lawyer';

  const handleAnalyze = async () => {
    if (id) {
      try {
        await analyzeDocumentAsync(id);
      } catch (error) {
        if (error.upgradeRequired) {
          setShowUpgradeModal(true);
        }
      }
    }
  };

  const handleGenerateReport = () => {
    if (id) {
      generateReport(id);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <Info className="w-5 h-5" />;
      case 'low':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const sampleContent = `This Non-Disclosure Agreement ("Agreement") is entered into as of [Date] by and between Party A and Party B.

WHEREAS, the parties wish to explore a business opportunity of mutual interest and benefit;

WHEREAS, in connection with such discussions, it may be necessary for each party to disclose certain Confidential Information to the other party;

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:

1. Definition of Confidential Information
"Confidential Information" means any information disclosed by one party to the other, either directly or indirectly, in writing, orally, or by inspection of tangible objects...

2. Non-Disclosure and Non-Use Obligations
Each party agrees to hold the other party's Confidential Information in strict confidence and not to disclose such information to third parties...

3. Termination
The termination of this Agreement shall not relieve either party of their obligations regarding non-compete provisions...`;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <AppLayout>
      <div className="flex h-full">
        <div className={`flex-1 space-y-6 max-w-4xl transition-all duration-300 ${isCommentSidebarOpen ? 'mr-80' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/documents')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {isLawyer && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShareModal(true)}
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCommentSidebarOpen(!isCommentSidebarOpen)}
                className="gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Comments
              </Button>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{document.title}</h1>
                <p className="text-muted-foreground mt-1">
                  {document.file?.split('/').pop() || 'Document'} • Uploaded {formatDate(document.uploaded_at)}
                </p>
              </div>
            </div>
          <Badge className={getRiskColor(document.risk_score || '')} variant="outline">
            <span className="flex items-center gap-2">
              {getRiskIcon(document.risk_score || '')}
              {document.risk_score || 'Not Analyzed'} Risk
            </span>
          </Badge>
        </div>

          <Tabs defaultValue="content" className="w-full">
            <TabsList>
              <TabsTrigger value="content" className="gap-2">
                <FileText className="w-4 h-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="versions" className="gap-2">
                <History className="w-4 h-4" />
                Versions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">File Name</p>
                      <p className="text-foreground mt-1">{document.file?.split('/').pop() || 'Document'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Upload Date</p>
                      <p className="text-foreground mt-1">{formatDate(document.uploaded_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <p className="text-foreground mt-1 capitalize">{document.status}</p>
                    </div>
                    {document.analyzed_at && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Analyzed</p>
                        <p className="text-foreground mt-1">{formatDate(document.analyzed_at)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Extracted Content</CardTitle>
                  <CardDescription>Document text with highlighted clauses and entities</CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentHighlights content={document.extracted_text || ''} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Analysis</CardTitle>
                  <CardDescription>
                    {document.status === 'pending' 
                      ? 'Run AI analysis to detect potential risks and concerns'
                      : 'AI-powered risk assessment results'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {document.status === 'pending' ? (
                    <div className="text-center py-8">
                      <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">
                        This document hasn't been analyzed yet
                      </p>
                      <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="gap-2"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4" />
                            Analyze Document
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${getRiskColor(document.risk_score || '')} flex items-center justify-center`}>
                          {getRiskIcon(document.risk_score || '')}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {document.risk_score || 'Unknown'} Risk Level Detected
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Analyzed on {formatDate(document.analyzed_at)}
                          </p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">Key Findings:</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Standard confidentiality clauses detected</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Non-compete provisions require review</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Termination conditions are clearly defined</span>
                          </li>
                        </ul>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => navigate(`/documents/${id}/analysis`)}
                          className="gap-2 flex-1"
                        >
                          <FileText className="w-4 h-4" />
                          View Full Analysis
                        </Button>
                        <Button 
                          onClick={handleAnalyze} 
                          disabled={isAnalyzing}
                          variant="outline"
                          className="gap-2"
                        >
                          {isAnalyzing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Brain className="w-4 h-4" />
                          )}
                        </Button>
                        <Button 
                          onClick={handleGenerateReport} 
                          disabled={isGeneratingReport}
                          variant="outline"
                          className="gap-2"
                        >
                          {isGeneratingReport ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="versions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Version History</CardTitle>
                  <CardDescription>
                    View all versions of this document
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {id && <VersionList documentId={id} />}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Comment Sidebar */}
        {id && (
          <div className="fixed right-0 top-0 h-full">
            <CommentSidebar
              documentId={id}
              isOpen={isCommentSidebarOpen}
              onClose={() => setIsCommentSidebarOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Upgrade Modal for 402 errors */}
      <UpgradeLimitModal 
        open={showUpgradeModal} 
        onOpenChange={setShowUpgradeModal} 
      />

      {/* Share Document Modal for lawyers */}
      {id && document && (
        <ShareDocumentModal
          open={showShareModal}
          onOpenChange={setShowShareModal}
          documentId={id}
          documentTitle={document.title}
        />
      )}
    </AppLayout>
  );
};

export default DocumentDetail;