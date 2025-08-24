import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

export interface TaskType {
  id: string;
  name: string;
  points: number;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  taskTypeId: string;
  proofUrl: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  userId: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewReason?: string;
  points: number;
}

export interface User {
  id: string;
  name: string;
  totalPoints: number;
  tasksCompleted: number;
}

interface AppState {
  currentUser: string;
  currentRole: 'user' | 'admin' | null;
  users: User[];
  tasks: Task[];
  taskTypes: TaskType[];
}

const initialState: AppState = {
  currentUser: 'user1',
  currentRole: null,
  users: [
    { id: 'user1', name: 'Alice Johnson', totalPoints: 1250, tasksCompleted: 12 },
    { id: 'user2', name: 'Bob Smith', totalPoints: 980, tasksCompleted: 8 },
    { id: 'user3', name: 'Carol Davis', totalPoints: 1450, tasksCompleted: 15 },
    { id: 'user4', name: 'David Wilson', totalPoints: 750, tasksCompleted: 6 },
    { id: 'user5', name: 'Emma Brown', totalPoints: 2100, tasksCompleted: 21 },
  ],
  tasks: [
    {
      id: 'task1',
      title: 'Design System Documentation',
      description: 'Create comprehensive documentation for the design system including color schemes, typography, and component usage.',
      taskTypeId: 'documentation',
      proofUrl: 'https://github.com/example/design-docs',
      tags: ['design', 'documentation', 'ui'],
      status: 'approved',
      userId: 'user1',
      submittedAt: new Date('2024-01-15'),
      reviewedAt: new Date('2024-01-16'),
      points: 150,
    },
    {
      id: 'task2',
      title: 'Bug Fix: Login Flow',
      description: 'Fixed critical bug in user authentication flow that was preventing users from logging in with social providers.',
      taskTypeId: 'bugfix',
      proofUrl: 'https://github.com/example/pull/123',
      tags: ['bug', 'authentication', 'critical'],
      status: 'pending',
      userId: 'user2',
      submittedAt: new Date('2024-01-20'),
      points: 100,
    },
    {
      id: 'task3',
      title: 'Feature: Dark Mode Toggle',
      description: 'Implemented dark mode toggle functionality with system preference detection and smooth animations.',
      taskTypeId: 'feature',
      proofUrl: 'https://github.com/example/pull/124',
      tags: ['feature', 'ui', 'accessibility'],
      status: 'pending',
      userId: 'user3',
      submittedAt: new Date('2024-01-21'),
      points: 125,
    },
  ],
  taskTypes: [
    { id: 'feature', name: 'Feature Development', points: 125, description: 'New feature implementation' },
    { id: 'bugfix', name: 'Bug Fix', points: 100, description: 'Fixing existing issues' },
    { id: 'documentation', name: 'Documentation', points: 150, description: 'Writing documentation' },
    { id: 'testing', name: 'Testing', points: 75, description: 'Writing tests' },
    { id: 'refactoring', name: 'Code Refactoring', points: 100, description: 'Code quality improvements' },
  ],
};

type AppAction =
  | { type: 'SET_ROLE'; payload: 'user' | 'admin' }
  | { type: 'SUBMIT_TASK'; payload: Omit<Task, 'id' | 'submittedAt' | 'status' | 'points'> }
  | { type: 'REVIEW_TASK'; payload: { taskId: string; status: 'approved' | 'rejected'; reason?: string } }
  | { type: 'ADD_TASK_TYPE'; payload: Omit<TaskType, 'id'> }
  | { type: 'UPDATE_TASK_TYPE'; payload: TaskType }
  | { type: 'DELETE_TASK_TYPE'; payload: string };

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, currentRole: action.payload };

    case 'SUBMIT_TASK': {
      const taskType = state.taskTypes.find(t => t.id === action.payload.taskTypeId);
      const newTask: Task = {
        ...action.payload,
        id: `task${Date.now()}`,
        submittedAt: new Date(),
        status: 'pending',
        points: taskType?.points || 0,
      };
      return { ...state, tasks: [...state.tasks, newTask] };
    }

    case 'REVIEW_TASK': {
      const { taskId, status, reason } = action.payload;
      const updatedTasks = state.tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            status,
            reviewedAt: new Date(),
            reviewReason: reason,
          };
        }
        return task;
      });

      let updatedUsers = state.users;
      if (status === 'approved') {
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
          updatedUsers = state.users.map(user => {
            if (user.id === task.userId) {
              return {
                ...user,
                totalPoints: user.totalPoints + task.points,
                tasksCompleted: user.tasksCompleted + 1,
              };
            }
            return user;
          });
        }
      }

      return { ...state, tasks: updatedTasks, users: updatedUsers };
    }

    case 'ADD_TASK_TYPE': {
      const newTaskType: TaskType = {
        ...action.payload,
        id: `type${Date.now()}`,
      };
      return { ...state, taskTypes: [...state.taskTypes, newTaskType] };
    }

    case 'UPDATE_TASK_TYPE': {
      const updatedTaskTypes = state.taskTypes.map(type =>
        type.id === action.payload.id ? action.payload : type
      );
      return { ...state, taskTypes: updatedTaskTypes };
    }

    case 'DELETE_TASK_TYPE': {
      const filteredTaskTypes = state.taskTypes.filter(type => type.id !== action.payload);
      return { ...state, taskTypes: filteredTaskTypes };
    }

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function useAppActions() {
  const { dispatch } = useApp();

  const setRole = (role: 'user' | 'admin') => {
    dispatch({ type: 'SET_ROLE', payload: role });
  };

  const submitTask = (taskData: Omit<Task, 'id' | 'submittedAt' | 'status' | 'points'>) => {
    dispatch({ type: 'SUBMIT_TASK', payload: taskData });
    toast({
      title: "Task Submitted!",
      description: "Your task has been submitted for review.",
    });
  };

  const reviewTask = (taskId: string, status: 'approved' | 'rejected', reason?: string) => {
    dispatch({ type: 'REVIEW_TASK', payload: { taskId, status, reason } });
    toast({
      title: status === 'approved' ? "Task Approved!" : "Task Rejected",
      description: status === 'approved' 
        ? "Points have been awarded to the user." 
        : "The task has been rejected with feedback.",
    });
  };

  const addTaskType = (taskType: Omit<TaskType, 'id'>) => {
    dispatch({ type: 'ADD_TASK_TYPE', payload: taskType });
    toast({
      title: "Task Type Added!",
      description: `${taskType.name} has been added successfully.`,
    });
  };

  const updateTaskType = (taskType: TaskType) => {
    dispatch({ type: 'UPDATE_TASK_TYPE', payload: taskType });
    toast({
      title: "Task Type Updated!",
      description: `${taskType.name} has been updated successfully.`,
    });
  };

  const deleteTaskType = (id: string) => {
    dispatch({ type: 'DELETE_TASK_TYPE', payload: id });
    toast({
      title: "Task Type Deleted!",
      description: "The task type has been removed.",
    });
  };

  return {
    setRole,
    submitTask,
    reviewTask,
    addTaskType,
    updateTaskType,
    deleteTaskType,
  };
}