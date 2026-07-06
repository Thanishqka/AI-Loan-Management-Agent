import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// 1. Users Table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  password: text('password').notNull(),
  role: text('role').notNull().default('USER'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// 2. Loan Applications Table
export const loanApplications = sqliteTable('loan_applications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  userName: text('user_name').notNull(),
  loanType: text('loan_type').notNull(),
  loanAmount: integer('loan_amount').notNull(),
  salary: integer('salary').notNull(),
  monthlyExpenses: integer('monthly_expenses').notNull(),
  employmentType: text('employment_type').notNull(),
  existingEmi: integer('existing_emi').notNull().default(0),
  tenure: integer('tenure').notNull(),
  status: text('status').notNull().default('PENDING'),
  appliedDate: text('applied_date').notNull(),
});

// 3. AI Analysis Reports Table
export const aiReports = sqliteTable('ai_reports', {
  id: text('id').primaryKey(),
  loanId: text('loan_id').notNull().references(() => loanApplications.id),
  eligibility: text('eligibility').notNull(),
  approvalProbability: text('approval_probability').notNull(),
  riskLevel: text('risk_level').notNull(),
  fraudRisk: text('fraud_risk').notNull(),
  fraudReason: text('fraud_reason').notNull(),
  incomeStabilityScore: integer('income_stability_score').notNull(),
  expenseControlScore: integer('expense_control_score').notNull(),
  debtRatioScore: integer('debt_ratio_score').notNull(),
  repaymentCapacityScore: integer('repayment_capacity_score').notNull(),
  employmentStabilityScore: integer('employment_stability_score').notNull(),
  overallSuccessScore: integer('overall_success_score').notNull(),
  recommendedBank: text('recommended_bank').notNull(),
  estimatedInterestRange: text('estimated_interest_range').notNull(),
  suggestedEmi: integer('suggested_emi').notNull(),
  financialTips: text('financial_tips').notNull(), // Stores JSON stringified string[]
  reason: text('reason').notNull(),
  generatedTime: text('generated_time').notNull(),
});

// 4. Chat History Table
export const chatHistory = sqliteTable('chat_history', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  question: text('question').notNull(),
  response: text('response').notNull(),
  createdTime: text('created_time').notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  loans: many(loanApplications),
  chats: many(chatHistory),
}));

export const loanApplicationsRelations = relations(loanApplications, ({ one, many }) => ({
  user: one(users, {
    fields: [loanApplications.userId],
    references: [users.id],
  }),
  reports: many(aiReports),
}));

export const aiReportsRelations = relations(aiReports, ({ one }) => ({
  loan: one(loanApplications, {
    fields: [aiReports.loanId],
    references: [loanApplications.id],
  }),
}));

export const chatHistoryRelations = relations(chatHistory, ({ one }) => ({
  user: one(users, {
    fields: [chatHistory.userId],
    references: [users.id],
  }),
}));
