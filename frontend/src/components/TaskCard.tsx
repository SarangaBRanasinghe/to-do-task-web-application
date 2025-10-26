import { Task } from '@/types/task.types';
import { Button } from './Button';

interface TaskCardProps {
  task: Task;
  onMarkDone: (id: number, title: string) => void;
  colorScheme: {
    bg: string;
    border: string;
    accent: string;
    hover: string;
  };
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onMarkDone,
  colorScheme,
}) => {
  return (
    <div
      className={`rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-200 border ${colorScheme.border} ${colorScheme.bg} ${colorScheme.hover} group`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-bold text-gray-900 mb-2 group-hover:text-${colorScheme.accent} transition-colors`}>
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {task.description || "No description"}
          </p>
        </div>
        <Button
          variant="success"
          onClick={() => onMarkDone(task.id, task.title)}
        >
          Done
        </Button>
      </div>
    </div>
  );
};