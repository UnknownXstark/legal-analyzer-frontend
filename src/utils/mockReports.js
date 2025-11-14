// Mock reports management using localStorage and document data

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockReports = {
  // Get all reports
  getReports: async () => {
    await delay(300);
    const docs = localStorage.getItem('documents');
    const documents = docs ? JSON.parse(docs) : [];
    
    // Generate reports from analyzed documents
    const reports = documents
      .filter(doc => doc.status === 'analyzed')
      .map(doc => ({
        id: doc.id,
        documentTitle: doc.title,
        date: doc.analyzedAt || doc.uploadedAt,
        overallRisk: doc.risk || 'Medium',
        fileName: doc.fileName
      }));
    
    return reports;
  },

  // Get report by ID
  getReportById: async (id) => {
    await delay(500);
    const docs = localStorage.getItem('documents');
    const documents = docs ? JSON.parse(docs) : [];
    const doc = documents.find(d => d.id === parseInt(id));
    
    if (!doc) return null;
    
    // Generate detailed report data
    const clauseTemplates = [
      { name: "Confidentiality", statuses: ["Compliant", "Needs Review"] },
      { name: "Termination", statuses: ["Compliant", "Risky", "Needs Review"] },
      { name: "Liability", statuses: ["Compliant", "Needs Review"] },
      { name: "Payment Terms", statuses: ["Compliant", "Needs Review"] },
      { name: "Intellectual Property", statuses: ["Compliant", "Risky"] },
      { name: "Non-Compete", statuses: ["Compliant", "Risky", "Needs Review"] },
      { name: "Indemnification", statuses: ["Compliant", "Needs Review"] },
      { name: "Dispute Resolution", statuses: ["Compliant", "Needs Review"] },
    ];
    
    const clauses = clauseTemplates.slice(0, 5 + Math.floor(Math.random() * 4)).map(template => ({
      name: template.name,
      status: template.statuses[Math.floor(Math.random() * template.statuses.length)]
    }));
    
    const recommendations = {
      'Low': [
        "Continue monitoring standard legal updates",
        "Schedule periodic review in 6 months"
      ],
      'Medium': [
        "Review highlighted clauses with legal counsel",
        "Consider negotiating ambiguous terms",
        "Add clearer definitions for key obligations",
        "Ensure all parties understand liability limitations"
      ],
      'High': [
        "Immediate legal counsel review required",
        "Renegotiate risky clauses before signing",
        "Add protective language to termination section",
        "Clarify liability and indemnification terms",
        "Consider alternative contract structures"
      ]
    };
    
    const summaries = {
      'Low': `The ${doc.title} is well-structured and follows industry standard practices. All clauses are clearly defined and pose minimal legal risk. The document is suitable for execution with standard review procedures.`,
      'Medium': `The ${doc.title} contains several clauses that warrant attention. While the overall structure is sound, certain provisions regarding termination and liability could be more clearly defined. Review is recommended before final execution.`,
      'High': `The ${doc.title} contains multiple high-risk clauses that require immediate attention. Several provisions pose significant legal and financial risks. Comprehensive legal review and renegotiation are strongly recommended before proceeding.`
    };
    
    return {
      id: doc.id,
      documentTitle: doc.title,
      fileName: doc.fileName,
      overallRisk: doc.risk || 'Medium',
      generatedDate: doc.analyzedAt || doc.uploadedAt,
      clauses,
      recommendations: recommendations[doc.risk || 'Medium'],
      summary: summaries[doc.risk || 'Medium'],
      statistics: {
        totalClauses: clauses.length,
        compliant: clauses.filter(c => c.status === 'Compliant').length,
        risky: clauses.filter(c => c.status === 'Risky').length,
        needsReview: clauses.filter(c => c.status === 'Needs Review').length
      }
    };
  },

  // Generate downloadable report content
  generateReportContent: (reportData) => {
    const content = `
═══════════════════════════════════════════════════════════
                    LEGAL DOCUMENT ANALYSIS REPORT
═══════════════════════════════════════════════════════════

Document: ${reportData.documentTitle}
File: ${reportData.fileName}
Analysis Date: ${reportData.generatedDate}
Overall Risk Level: ${reportData.overallRisk}

───────────────────────────────────────────────────────────
EXECUTIVE SUMMARY
───────────────────────────────────────────────────────────

${reportData.summary}

───────────────────────────────────────────────────────────
CLAUSE ANALYSIS
───────────────────────────────────────────────────────────

Total Clauses Analyzed: ${reportData.statistics.totalClauses}
  ✓ Compliant: ${reportData.statistics.compliant}
  ⚠ Needs Review: ${reportData.statistics.needsReview}
  ✗ Risky: ${reportData.statistics.risky}

Detailed Breakdown:
${reportData.clauses.map((clause, idx) => 
  `${idx + 1}. ${clause.name.padEnd(30)} [${clause.status}]`
).join('\n')}

───────────────────────────────────────────────────────────
RECOMMENDATIONS
───────────────────────────────────────────────────────────

${reportData.recommendations.map((rec, idx) => 
  `${idx + 1}. ${rec}`
).join('\n')}

───────────────────────────────────────────────────────────
DISCLAIMER
───────────────────────────────────────────────────────────

This report is generated by AI-powered analysis and should not be 
considered as legal advice. Always consult with a qualified legal 
professional before making decisions based on this analysis.

═══════════════════════════════════════════════════════════
Report Generated by AI Legal Document Analyzer
═══════════════════════════════════════════════════════════
    `.trim();
    
    return content;
  }
};
