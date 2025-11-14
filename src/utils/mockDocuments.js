// Mock document management using localStorage

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockDocuments = {
  // Get all documents
  getDocuments: async () => {
    await delay(300);
    const docs = localStorage.getItem('documents');
    return docs ? JSON.parse(docs) : [];
  },

  // Get document by ID
  getDocumentById: async (id) => {
    await delay(300);
    const docs = localStorage.getItem('documents');
    const documents = docs ? JSON.parse(docs) : [];
    return documents.find(doc => doc.id === parseInt(id));
  },

  // Add new document
  addDocument: async (documentData) => {
    await delay(500);
    const docs = localStorage.getItem('documents');
    const documents = docs ? JSON.parse(docs) : [];
    
    const newDoc = {
      id: Date.now(),
      ...documentData,
      uploadedAt: new Date().toLocaleString(),
      risk: 'Pending',
      status: 'pending'
    };
    
    documents.push(newDoc);
    localStorage.setItem('documents', JSON.stringify(documents));
    return newDoc;
  },

  // Delete document
  deleteDocument: async (id) => {
    await delay(300);
    const docs = localStorage.getItem('documents');
    const documents = docs ? JSON.parse(docs) : [];
    const filtered = documents.filter(doc => doc.id !== parseInt(id));
    localStorage.setItem('documents', JSON.stringify(filtered));
    return true;
  },

  // Analyze document (mock)
  analyzeDocument: async (id) => {
    await delay(2000);
    const docs = localStorage.getItem('documents');
    const documents = docs ? JSON.parse(docs) : [];
    
    const risks = ['Low', 'Medium', 'High'];
    const randomRisk = risks[Math.floor(Math.random() * risks.length)];
    
    const updatedDocs = documents.map(doc => 
      doc.id === parseInt(id) 
        ? { ...doc, risk: randomRisk, status: 'analyzed', analyzedAt: new Date().toLocaleString() }
        : doc
    );
    
    localStorage.setItem('documents', JSON.stringify(updatedDocs));
    return { risk: randomRisk };
  },

  // Get detailed analysis for a document
  getAnalysis: async (id) => {
    await delay(1000);
    const doc = await mockDocuments.getDocumentById(id);
    
    if (!doc) return null;
    
    // Generate mock analysis based on document
    const clauseTemplates = [
      { name: "Confidentiality", statuses: ["Compliant", "Needs Review"] },
      { name: "Termination", statuses: ["Compliant", "Risky", "Needs Review"] },
      { name: "Liability", statuses: ["Compliant", "Needs Review"] },
      { name: "Payment Terms", statuses: ["Compliant", "Needs Review"] },
      { name: "Intellectual Property", statuses: ["Compliant", "Risky"] },
      { name: "Non-Compete", statuses: ["Compliant", "Risky", "Needs Review"] },
    ];
    
    const clauses = clauseTemplates.slice(0, 4 + Math.floor(Math.random() * 3)).map(template => ({
      name: template.name,
      status: template.statuses[Math.floor(Math.random() * template.statuses.length)]
    }));
    
    const extractedText = `This Agreement is made on the 3rd of June, 2024 between Alpha Corp ("Company") and Beta Ltd ("Party"). 

WHEREAS, the Company desires to engage the Party for certain services, and the Party agrees to provide such services subject to the terms and conditions set forth herein.

1. CONFIDENTIALITY
The Party agrees to maintain confidentiality of all proprietary information disclosed by the Company during the term of this Agreement and for a period of three (3) years thereafter.

2. TERMINATION
Either party may terminate this Agreement with thirty (30) days written notice. Upon termination, all confidential materials must be returned.

3. LIABILITY
The Company's liability under this Agreement shall be limited to the amount paid by the Party in the twelve (12) months preceding the claim.

4. INTELLECTUAL PROPERTY
All intellectual property created during the term of this Agreement shall be the exclusive property of the Company.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.`;
    
    const summaries = {
      'Low': 'The document appears to be well-structured with standard clauses that align with industry best practices. No significant risks identified.',
      'Medium': 'The document contains some clauses that may require attention. Review the highlighted items to ensure they align with your business requirements.',
      'High': 'The document contains potentially risky clauses that should be carefully reviewed by legal counsel before proceeding. Several areas require immediate attention.'
    };
    
    return {
      clauses,
      overallRisk: doc.risk || 'Medium',
      summary: summaries[doc.risk || 'Medium'],
      extractedText,
      analyzedAt: doc.analyzedAt || new Date().toLocaleString()
    };
  }
};
