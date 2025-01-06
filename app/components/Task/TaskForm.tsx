import { Form, useNavigation } from "@remix-run/react";
import {
  Stack,
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  ActionIcon,
  Text
} from "@mantine/core";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import type { User } from "../../types/types";

interface TaskFormProps {
  users: User[];
  onFormSubmit: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ users, onFormSubmit }) => {
  const navigation = useNavigation();
  const [subtasks, setSubtasks] = useState<{ name: string }[]>([]);
  const [newSubtask, setNewSubtask] = useState("");

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { name: newSubtask.trim() }]);
      setNewSubtask("");
    }
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const formatUserName = (user: User) => `${user.firstName} ${user.lastName}`;

  const handleFormSubmit = () => {
    onFormSubmit();
  };

  return (
    <Form method="post" onSubmit={handleFormSubmit}>
      <Stack gap="md">
        <TextInput required label="Task Title" name="title" placeholder="Enter task title"/>
        <Textarea label="Description" name="description" placeholder="Enter description (optional)" />
        <Select required label="Status" name="state"
          data={[
            { value: "TODO", label: "To Do" },
            { value: "DOING", label: "In Progress" },
            { value: "DONE", label: "Completed" },
          ]}
          defaultValue="TODO"
        />
        <Select required label="Assigned To" name="ownerId" 
        data={users.map((user) => ({
                value: user.id,
                label: formatUserName(user),
                }))
            }
          placeholder="Select a user"
        />

        <div>
          <Text size="sm" fw={500} mb="xs"> Subtasks </Text>
          <Group mb="xs">
            <TextInput placeholder="Enter subtask" value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} style={{ flex: 1 }}/>
            <Button onClick={addSubtask} variant="light" disabled={!newSubtask.trim()}>
              <Plus size={16} />
            </Button>
          </Group>

          {subtasks.map((subtask, index) => (
            <Group key={index} mb="xs">
              <Text size="sm" style={{ flex: 1 }}>
                {subtask.name}
              </Text>
              <ActionIcon color="red" variant="light" onClick={() => removeSubtask(index)}>
                <X size={16} />
              </ActionIcon>
            </Group>
          ))}
        </div>

        <input type="hidden" name="subtasks" value={JSON.stringify(subtasks)} />

        <Button type="submit" loading={navigation.state === "submitting"} disabled={navigation.state === "submitting"}>
            {navigation.state === "submitting" ? "Adding..." : "Add Task"}
        </Button>
      </Stack>
    </Form>
  );
};

export default TaskForm;
