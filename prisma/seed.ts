import { PrismaClient, TaskState } from "@prisma/client";
const prisma = new PrismaClient();


 

async function main() {
  // 1. Add users
  const users = [
    { id: '1', firstName: 'Jean-Marc', lastName: 'Janco' },
    { id: '2', firstName: 'Bob', lastName: 'Johnson' },
    { id: '3', firstName: 'Charlie', lastName: 'Brown' },
    { id: '4', firstName: 'Diana', lastName: 'Jones' },
    { id: '5', firstName: 'Ethan', lastName: 'Davis' },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }

  // 2. Add tasks
  const tasks = [
    { id: '1', title: 'Setup project', description: 'Initialize the repository and set up the environment', state: TaskState.TODO, ownerId: '2', order: 1 },
    { id: '2', title: 'Design UI', description: 'Create wireframes and mockups', state: TaskState.DOING, ownerId: '3', order: 2 },
    { id: '3', title: 'Develop API', description: 'Build the backend API endpoints', state: TaskState.DONE, ownerId: '4', order: 3 },
    { id: '4', title: 'Write tests', description: 'Write unit and integration tests', state: TaskState.TODO, ownerId: '5', order: 4 },
    { id: '5', title: 'Deploy application', description: 'Deploy the app to production', state: TaskState.TODO, ownerId: '2', order: 5 },
  ];

  for (const task of tasks) {
    await prisma.task.upsert({
      where: { id: task.id },
      update: task,
      create: task,
    });
  }

  // 3. Add subtasks
  const subtasks = [
    { id: '1', name: 'Install dependencies', state: true, taskId: '1' },
    { id: '2', name: 'Configure environment variables', state: false, taskId: '1' },
    { id: '3', name: 'Create homepage wireframe', state: true, taskId: '2' },
    { id: '4', name: 'Design login form', state: false, taskId: '2' },
    { id: '5', name: 'Implement user authentication', state: true, taskId: '3' },
  ];

  for (const subtask of subtasks) {
    await prisma.subtask.upsert({
      where: { id: subtask.id },
      update: subtask,
      create: subtask,
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });