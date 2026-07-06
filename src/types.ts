export type Role = 'USER' | 'ADMIN';
export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
}

export interface LoanApplication {
  id: string;
  userId: string;
  userName?: string; // Cache user name for admin view
  loanType: 'Personal' | 'Home' | 'Car' | 'Education' | 'Business';
  loanAmount: number;
  salary: number;
  monthlyExpenses: number;
  employmentType: 'Salaried' | 'Self-Employed' | 'Business Owner' | 'Unemployed';
  existingEmi: number;
  tenure: number; // in months
  status: LoanStatus;
  appliedDate: string;
}

export interface AIReport {
  id: string;
  loanId: string;
  eligibility: string;
  approvalProbability: string; // e.g., "85%"
  riskLevel: 'Low' | 'Medium' | 'High';
  fraudRisk: 'Low' | 'Medium' | 'High';
  fraudReason: string;
  incomeStabilityScore: number; // 0-100
  expenseControlScore: number; // 0-100
  debtRatioScore: number; // 0-100
  repaymentCapacityScore: number; // 0-100
  employmentStabilityScore: number; // 0-100
  overallSuccessScore: number; // 0-100
  recommendedBank: string;
  estimatedInterestRange: string;
  suggestedEmi: number;
  financialTips: string[];
  reason: string;
  generatedTime: string;
}

export interface ChatHistory {
  id: string;
  userId: string;
  question: string;
  response: string;
  createdTime: string;
}
