import { Card, Group, Text, Badge, Stack, ActionIcon } from '@mantine/core';
import { Form } from "@remix-run/react";
import { Trash } from "lucide-react";
import type { TaskCardProps } from "../../types/types";



export default function TaskCard({
  task,
  navigationState,
  formatUserName,
  getStateColor,
}: TaskCardProps) {
  return (
    <Card key={task.id} shadow="sm" mb="sm" radius="md">
      <Group justify="space-between" align="flex-start">
        <Group>
          <Text size="lg" fw={500}>{task.title}</Text>
          <Badge color={getStateColor(task.state)}>{task.state}</Badge>
          <Badge variant="light">
            Assigned to: {formatUserName(task.owner)}
          </Badge>
        </Group>
        <Form method="post">
          <input type="hidden" name="taskId" value={task.id} />
          <input type="hidden" name="intent" value="delete" />
          <ActionIcon type="submit" color="red" variant="light" size="lg" loading={navigationState === "submitting"}>
            <Trash size={20} />
          </ActionIcon>
        </Form>
      </Group>
      {task.description && (
        <Text c="dimmed" mt="xs">
          {task.description}
        </Text>
      )}
      {task.subtasks.length > 0 && (
        <Stack mt="md" gap="xs">
          <Text fw={500}>Subtasks:</Text>
          {task.subtasks.map((subtask) => (
            <Group key={subtask.id} justify="flex-start">
              <input
                type="checkbox"
                checked={subtask.state}
                readOnly
              />
              <Text size="sm">{subtask.name}</Text>
            </Group>
          ))}
        </Stack>
      )}
    </Card>
  );
}
