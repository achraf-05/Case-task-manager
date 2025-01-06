import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useRevalidator, Form, useNavigation } from "@remix-run/react";
import { Container, Card} from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { db } from "../server/db.server";
import type { User, Subtask, Task, LoaderData, TaskState} from "../types/types";
import TaskForm from "../components/Task/TaskForm";
import TaskCard from "../components/Task/TaskCard";




export const loader: LoaderFunction = async () => {
  const [tasks, users] = await Promise.all([
    db.task.findMany({
      include: {
        subtasks: true,
        owner: true,
      },
      orderBy: {
        order: 'asc'
      }
    }),
    db.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
      }
    })
  ]);

  return json<LoaderData>({ tasks, users });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  
  if (request.method === 'POST') {
    const intent = formData.get("intent");

    if (intent === "delete") {
      const taskId = formData.get("taskId") as string;
      
      await db.subtask.deleteMany({
        where: { taskId }
      });

      await db.task.delete({
        where: { id: taskId }
      });

      return redirect("/tasks");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const state = formData.get("state") as "TODO" | "DOING" | "DONE";
    const ownerId = formData.get("ownerId") as string;
    const subtasksJson = formData.get("subtasks") as string;
    const subtasks = JSON.parse(subtasksJson || "[]");

    if (!title) {
      return json({ error: "Title is required" }, { status: 400 });
    }

    if (!ownerId) {
      return json({ error: "User assignment is required" }, { status: 400 });
    }

    const lastTask = await db.task.findFirst({
      orderBy: { order: 'desc' },
    });
    const newOrder = (lastTask?.order ?? 0) + 1;

    await db.task.create({
      data: {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description: description || null,
        state: state as TaskState,
        order: newOrder,
        ownerId,
        subtasks: {
          create: subtasks.map((subtask: { name: string }) => ({
            id: Math.random().toString(36).substr(2, 9),
            name: subtask.name,
            state: false
          }))
        }
      },
    });
  } else if (request.method === 'PATCH') {
    const tasks = JSON.parse(formData.get("tasks") as string) as Task[];
    
    await Promise.all(
      tasks.map((task, index) =>
        db.task.update({
          where: { id: task.id },
          data: { order: index },
        })
      )
    );
  }

  return redirect("/tasks");
};


export default function Tasks() {
  const { tasks, users } = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const [state, handlers] = useListState(tasks);
  const { revalidate } = useRevalidator(); 

  const getStateColor = (state: "TODO" | "DOING" | "DONE") => {
    switch (state) {
      case 'TODO': return 'yellow';
      case 'DOING': return 'blue';
      case 'DONE': return 'green';
      default: return 'gray';
    }
  };

  const formatUserName = (user: User) => `${user.firstName} ${user.lastName}`;

  return (
    <Container my="md">
      <Card shadow="sm" radius="md" mb="xl">
        <TaskForm users={users} onFormSubmit={revalidate}  />
      </Card>

      <div>
        {state.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            navigationState={navigation.state}
            formatUserName={formatUserName}
            getStateColor={getStateColor}
          />
        ))}
      </div>
    </Container>
  );
}

