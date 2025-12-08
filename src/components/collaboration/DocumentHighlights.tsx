import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Clause {
  type: string;
  text: string;
  start: number;
  end: number;
}

interface Entity {
  type: string;
  text: string;
  start: number;
  end: number;
}

interface DocumentHighlightsProps {
  content: string;
  clauses?: Clause[];
  entities?: Entity[];
}

// Mock data for demonstration (would come from analysis results)
const mockClauses: Clause[] = [
  {
    type: "confidentiality",
    text: "Confidential Information",
    start: 0,
    end: 24,
  },
  {
    type: "termination",
    text: "termination of this Agreement",
    start: 100,
    end: 130,
  },
  { type: "non-compete", text: "non-compete provisions", start: 200, end: 222 },
];

const mockEntities: Entity[] = [
  { type: "organization", text: "Party A", start: 50, end: 57 },
  { type: "organization", text: "Party B", start: 62, end: 69 },
  { type: "date", text: "[Date]", start: 150, end: 156 },
];

const DocumentHighlights = ({
  content,
  clauses = mockClauses,
  entities = mockEntities,
}: DocumentHighlightsProps) => {
  // Combine and sort all highlights by position
  const allHighlights = [
    ...clauses.map((c) => ({ ...c, highlightType: "clause" as const })),
    ...entities.map((e) => ({ ...e, highlightType: "entity" as const })),
  ].sort((a, b) => a.start - b.start);

  const getHighlightClass = (
    type: string,
    highlightType: "clause" | "entity"
  ) => {
    if (highlightType === "clause") {
      return "bg-success/20 text-success border-b-2 border-success cursor-help";
    }
    return "bg-primary/20 text-primary border-b-2 border-primary cursor-help";
  };

  const getLabel = (type: string) => {
    const labels: Record<string, string> = {
      confidentiality: "Confidentiality Clause",
      termination: "Termination Clause",
      "non-compete": "Non-Compete Clause",
      organization: "Organization",
      date: "Date",
      person: "Person",
    };
    return labels[type] || type;
  };

  // Build highlighted content
  const renderHighlightedContent = () => {
    if (allHighlights.length === 0) {
      return <span>{content}</span>;
    }

    const elements: React.ReactNode[] = [];
    let lastEnd = 0;

    allHighlights.forEach((highlight, index) => {
      // Add text before this highlight
      if (highlight.start > lastEnd) {
        elements.push(
          <span key={`text-${index}`}>
            {content.slice(lastEnd, highlight.start)}
          </span>
        );
      }

      // Add the highlighted text
      elements.push(
        <TooltipProvider key={`highlight-${index}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={getHighlightClass(
                  highlight.type,
                  highlight.highlightType
                )}
              >
                {highlight.text}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    highlight.highlightType === "clause"
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-primary/10 text-primary border-primary/20"
                  }
                >
                  {highlight.highlightType === "clause" ? "Clause" : "Entity"}
                </Badge>
                <span>{getLabel(highlight.type)}</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      lastEnd = highlight.end;
    });

    // Add remaining text
    if (lastEnd < content.length) {
      elements.push(<span key="text-final">{content.slice(lastEnd)}</span>);
    }

    return elements;
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-success/20 border-b-2 border-success" />
          <span className="text-muted-foreground">Clauses</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-primary/20 border-b-2 border-primary" />
          <span className="text-muted-foreground">Entities</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-muted/30 rounded-lg border border-border">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {renderHighlightedContent()}
        </p>
      </div>
    </div>
  );
};

export default DocumentHighlights;
