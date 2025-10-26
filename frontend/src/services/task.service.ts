import { Task, CreateTaskDTO } from '@/types/task.types';

class TaskService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;

  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async createTask(task: CreateTaskDTO): Promise<Task> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error('Failed to create task');
      return response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async markTaskAsDone(id: number): Promise<Task> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tasks/${id}/done`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to mark task as done');
      return response.json();
    } catch (error) {
      console.error('Error marking task as done:', error);
      throw error;
    }
  }
}

export const taskService = new TaskService();