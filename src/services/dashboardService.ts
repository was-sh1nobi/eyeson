import { httpService } from "@/utils/httpService.ts";

type ProjectViewsResponse = {
    totalViews: number;
};

type ProjectViewResponse = {
    uuid: string;
    projectname: string;
    view: number;
};

type RequestsCountResponse = {
    total: number;
    todayCount: number;
    yesterdayCount: number;
    percentage: number;
};

type RequestsCompletedResponse = {
    completed: number;
    todayCount: number;
    yesterdayCount: number;
    percentage: number;
};

type LatestProjectItem = {
    cover: string;
    title: string;
    slug: string;
    ownerName: string;
    updatedAt: string;
    views: number;
};

type LatestProjectsResponse = {
    totalCount: number;
    projects: LatestProjectItem[];
};

export const dashboardService = {
    async getTotalViews(): Promise<ProjectViewsResponse> {
        return httpService.get<ProjectViewsResponse>("/project/views");
    },

    async getProjectView(uuid: string): Promise<ProjectViewResponse> {
        return httpService.get<ProjectViewResponse>(`/project/views?uuid=${uuid}`);
    },

    async getRequestsCount(): Promise<RequestsCountResponse> {
        return httpService.get<RequestsCountResponse>("/contact/requests/count");
    },

    async getRequestsCompleted(): Promise<RequestsCompletedResponse> {
        return httpService.get<RequestsCompletedResponse>("/contact/requests/completed");
    },

    async getLatestProjects(): Promise<LatestProjectsResponse> {
        return httpService.get<LatestProjectsResponse>("/project/latest");
    },

    async getAllProjects(): Promise<LatestProjectsResponse> {
        return httpService.get<LatestProjectsResponse>("/project/all");
    },

    async getLatestRequests(): Promise<LatestRequest[]> {
        return httpService.get<LatestRequest[]>("/contact/requests/latest");
    },

    async getAllRequests(page: number = 1, limit: number = 10): Promise<AllRequestsResponse> {
        return httpService.get<AllRequestsResponse>(`/contact/requests/all?page=${page}&limit=${limit}`);
    },

    // --- Email Management ---

    async getRequestsForEmail(params: GetRequestsForEmailParams): Promise<AllRequestsResponse> {
        const query = new URLSearchParams();
        query.set("page", String(params.page || 1));
        query.set("limit", String(params.limit || 10));
        if (params.projectType) query.set("projectType", params.projectType);
        if (params.status) query.set("status", params.status);
        if (params.budget) query.set("budget", params.budget);
        if (params.priority) query.set("priority", params.priority);
        if (params.search) query.set("search", params.search);
        return httpService.get<AllRequestsResponse>(`/contact/requests/all?${query.toString()}`);
    },

    async sendEmail(data: SendEmailPayload): Promise<SendEmailResponse> {
        return httpService.post<SendEmailResponse>("/email/send", data);
    },

    async getEmailHistory(page: number = 1, limit: number = 10): Promise<EmailHistoryResponse> {
        return httpService.get<EmailHistoryResponse>(`/email/history?page=${page}&limit=${limit}`);
    },

    async getProjectTypes(): Promise<string[]> {
        return httpService.get<string[]>("/contact/project-types");
    },

    async updateProjectTypes(projectTypes: string[]): Promise<void> {
        return httpService.put<void>("/contact/requests/project-types", { projectTypes });
    },

    // --- Notifications ---

    async getUnreadNotifications(): Promise<NotificationItem[]> {
        return httpService.get<NotificationItem[]>("/notifications/unread");
    },

    async markNotificationsRead(): Promise<void> {
        return httpService.post<void>("/notifications/read");
    },
};

type LatestRequest = {
    title: string;
    from: string;
    status: string;
};

type RequestItem = {
    id: string;
    title: string;
    from: string;
    createdAt: string;
    status: string;
    priority: string;
};

type AllRequestsResponse = {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
    requests: RequestItem[];
    projectTypes: string[];
    budgets: string[];
    meta?: {
        companies: number;
        budget_count: number;
        project_type_count: number;
    };
};

// --- Email Types ---

export type EmailRequest = {
  id: string;
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string;
  projectType: string;
  budget: string;
  projectDetails: string;
  date: string;
  duration: string;
  time: string;
  title: string;
  from: string;
  createdAt: string;
  status: string;
  priority: string;
};

export type GetRequestsForEmailParams = {
    page?: number;
    limit?: number;
    projectType?: string;
    status?: string;
    budget?: string;
    priority?: string;
    search?: string;
};

export type SendEmailPayload = {
    to: string[];
    subject: string;
    body: string;
    requestIds?: string[];
};

export type SendEmailDetail = {
    email: string;
    status: "sent" | "failed";
    error?: string;
};

export type SendEmailResponse = {
    success: boolean;
    sent: number;
    failed: number;
    details: SendEmailDetail[];
};

export type EmailLogItem = {
    id: string;
    to: string[];
    toNames?: string[];
    toDetails?: { email: string; name: string; company?: string; projectType?: string }[];
    subject: string;
    body: string;
    sentAt: string;
    status: string;
    requestIds: string[];
    requestCount?: number;
    sentBy: string;
};

export type NotificationItem = {
    id: string;
    title?: string;
    message?: string;
    from?: string;
    requestId?: string;
    createdAt: string;
    read: boolean;
};

export type EmailHistoryResponse = {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
    items: EmailLogItem[];
};
