import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ArrowLeft, FileText, Calendar, AlertTriangle, CheckCircle, XCircle, 
  ChevronDown, ChevronUp, Info, Bot, Brain, Loader2 
} from 'lucide-react';
import { useDocument, useDocuments } from '@/hooks/useDocuments';
import UpgradeLimitModal from '@/components/UpgradeLimitModal';

interface Entity {
  text: string;
  label: string;
  position?: number;
}

const DocumentAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { document, isLoading } = useDocument(id);
  const { analyzeDocumentAsync, isAnalyzing } = useDocuments();
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleAnalyze = async () => {
    if (id) {
      try {
        await analyzeDocumentAsync(id);
      } catch (error: any) {
        if (error.upgradeRequired) {
          setShowUpgradeModal(true);
        }
      }
    }
  };

  const getRiskBadgeStyles = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-success text-success-foreground';
      case 'Medium':
        return 'bg-warning text-warning-foreground';
      case 'High':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getEntityLabelColor = (label: string) => {
    switch (label) {
      case 'ORG':
        return 'bg-primary/10 text-primary';
      case 'DATE':
        return 'bg-success/10 text-success';
      case 'DURATION':
        return 'bg-warning/10 text-warning';
      case 'MONEY':
        return 'bg-destructive/10 text-destructive';
      case 'GPE':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </AppLayout>
    );
  }

  if (!document) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Document Not Found</h2>
          <p className="text-muted-foreground mb-6">The document could not be loaded.</p>
          <Button onClick={() => navigate('/documents')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </Button>
        </div>
      </AppLayout>
    );
  }

  // Check if document has been analyzed
  const isAnalyzed = document.status === 'analyzed';
  const clauses = document.clauses_found || {};
  const clauseEntries = Object.entries(clauses);
  const foundCount = clauseEntries.filter(([_, found]) => found).length;
  const entities: Entity[] = (document as any).entities || [];

  // Show analyze prompt if not analyzed
  if (!isAnalyzed) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/documents')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <FileText className="w-7 h-7 text-primary" />
                {document.title}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                Uploaded: {document.uploaded_at}
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Brain className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Analysis Required</h2>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                This document hasn't been analyzed yet. Run AI analysis to detect clauses, entities, and risk assessment.
              </p>
              <Button onClick={handleAnalyze} disabled={isAnalyzing} size="lg">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Document
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <UpgradeLimitModal 
          open={showUpgradeModal} 
          onOpenChange={setShowUpgradeModal} 
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/documents')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <FileText className="w-7 h-7 text-primary" />
                {document.title}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                Uploaded: {document.uploaded_at}
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Summary (Collapsible) */}
        {document.summary && (
          <Collapsible open={summaryOpen} onOpenChange={setSummaryOpen}>
            <Card className="animate-scale-in">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-primary" />
                        AI Summary
                      </CardTitle>
                      <CardDescription>AI-generated document overview</CardDescription>
                    </div>
                    {summaryOpen ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{document.summary}</p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Analyzed: {document.analyzed_at}
                  </p>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Section 2: Risk Score */}
        {document.risk_score && (
          <Card className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Overall document risk level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge className={`text-lg px-4 py-2 ${getRiskBadgeStyles(document.risk_score)}`}>
                  {document.risk_score} Risk
                </Badge>
                <span className="text-muted-foreground">
                  {document.risk_score === 'Low' && 'Document follows standard legal practices'}
                  {document.risk_score === 'Medium' && 'Some clauses may need review'}
                  {document.risk_score === 'High' && 'Immediate legal review recommended'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 3: Clauses Found (Checklist) */}
          {clauseEntries.length > 0 && (
            <Card className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle>Clause Checklist</CardTitle>
                <CardDescription>
                  {foundCount} of {clauseEntries.length} clause types detected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {clauseEntries.map(([clauseName, found]) => (
                    <div
                      key={clauseName}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        found
                          ? 'bg-success/5 border-success/20'
                          : 'bg-destructive/5 border-destructive/20'
                      }`}
                    >
                      <span className="font-medium text-sm capitalize">{clauseName.replace(/_/g, ' ')}</span>
                      {found ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section 4: Entities Table - Only show if entities exist */}
          {entities.length > 0 && (
            <Card className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle>Named Entities</CardTitle>
                <CardDescription>
                  {entities.length} entities extracted via NLP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Text</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead className="text-right">Position</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entities.map((entity, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{entity.text}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getEntityLabelColor(entity.label)}>
                            {entity.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {entity.position ?? '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Section 5: Raw Extracted Text */}
        {document.extracted_text && (
          <Card className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle>Raw Extracted Text</CardTitle>
              <CardDescription>Document content extracted for analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                  {document.extracted_text}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Accuracy Notice */}
        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium">AI Analysis Notice</p>
            <p className="text-sm text-muted-foreground">
              AI results are generated using spaCy + HuggingFace. Results should be reviewed by legal professionals before making decisions.
            </p>
          </div>
        </div>
      </div>

      <UpgradeLimitModal 
        open={showUpgradeModal} 
        onOpenChange={setShowUpgradeModal} 
      />
    </AppLayout>
  );
};

export default DocumentAnalysis;
