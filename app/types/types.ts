export type User = {
    id: string;
    firstName: string;
    lastName: string;
  };
  
  export type Subtask = {
    id: string;
    name: string;
    state: boolean;
  };
  
  export type Task = {
    id: string;
    title: string;
    description: string | null;
    state: "TODO" | "DOING" | "DONE";
    subtasks: Subtask[];
    order: number;
    ownerId: string;
    owner: User;
  };
  
  export type LoaderData = {
    tasks: Task[];
    users: User[];
  };

  export type TaskCardProps = {
    task: Task;
    navigationState: "idle" | "submitting" | "loading";
    formatUserName: (user: User) => string;
    getStateColor: (state: "TODO" | "DOING" | "DONE") => string;
  };
  
  export enum TaskState {
    TODO = "TODO",
    DOING = "DOING",
    DONE = "DONE"
  }
  