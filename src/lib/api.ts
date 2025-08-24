const API_BASE = "http://localhost:5000/api";

export const getTasks = async () => {
  const res = await fetch(`${API_BASE}/tasks`);
  return res.json();
};

export const reviewTask = async (id: string, status: string, reason?: string) => {
  const res = await fetch(`${API_BASE}/tasks/${id}/review`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, reason }),
  });
  return res.json();
};

export const getTaskTypes = async () => {
  const res = await fetch(`${API_BASE}/task-types`);
  return res.json();
};

export const addTaskType = async (data: any) => {
  const res = await fetch(`${API_BASE}/task-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateTaskType = async (id: string, data: any) => {
  const res = await fetch(`${API_BASE}/task-types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteTaskType = async (id: string) => {
  await fetch(`${API_BASE}/task-types/${id}`, { method: "DELETE" });
};

export const getUserCount = async () => {
  const res = await fetch(`${API_BASE}/users/count`);
  return res.json();
};
