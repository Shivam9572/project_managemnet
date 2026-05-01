export type Role = "admin" | "member";
export type TaskStatus = "todo" | "in_progress" | "done";
export type Priority = "low" | "medium" | "high" | "urgent";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type Project = {
  id: number;
  name: string;
  description?: string | null;
  ownerId: number;
  owner?: User;
  members?: Array<User & { projectmembers?: { role: Role } }>;
  tasks?: Task[];
  createdAt: string;
};

export type Task = {
  id: number;
  projectId: number;
  assignedTo?: number | null;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string | null;
  assignee?: User | null;
  project?: Pick<Project, "id" | "name" | "ownerId">;
  comments?: TaskComment[];
  createdAt: string;
};

export type TaskComment = {
  id: number;
  taskId: number;
  userId: number;
  comment: string;
  author?: User;
  createdAt: string;
};

export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Paged<T> = {
  data: T[];
  meta: PageMeta;
};

export type DashboardStats = {
  totalProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
};
