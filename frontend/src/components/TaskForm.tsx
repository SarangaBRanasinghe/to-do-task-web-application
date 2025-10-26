import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { TextArea } from './TextArea';
import { CreateTaskDTO } from '@/types/task.types';

interface TaskFormProps {
  onSubmit: (task: CreateTaskDTO) => Promise<void>;
  isLoading: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: { title?: string; description?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if valid
    setErrors({});
    
    // Submit
    await onSubmit({ title, description });
    
    // Reset form
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="title"
        label="Title"
        type="text"
        placeholder="Enter task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      
      <TextArea
        id="description"
        label="Description"
        placeholder="Add task details..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        error={errors.description}
      />

      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full"
      >
        Add Task
      </Button>
    </form>
  );
};