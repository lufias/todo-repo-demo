import localforage from 'localforage';

// Configure localforage to use localStorage
localforage.setDriver(localforage.LOCALSTORAGE);

// Types
export interface Folder {
  id: string;
  name: string;
}

export interface List {
  id: string;
  folderId: string;
  content: string;
}

export interface Task {
  id: string;
  listId: string;
  title: string;
  description?: string;
  done: boolean;
  tags?: string[];
  priority: 'low' | 'medium' | 'high';
}

// ID Management
async function getNextId(entity: 'folder' | 'list' | 'task'): Promise<number> {
  const counterKey = `${entity}_id_counter`;
  let current = await localforage.getItem<number>(counterKey);

  if (!current) current = 1;
  else current += 1;

  await localforage.setItem(counterKey, current);
  return current;
}

// Folder Operations
export async function addFolder(name: string): Promise<Folder> {
  const id = await getNextId('folder');
  const folder: Folder = {
    id: `fldr${id}`,
    name
  };
  await localforage.setItem(`folder:${folder.id}`, folder);
  return folder;
}

export async function renameFolder(id: string, newName: string): Promise<Folder | null> {
  const folder = await getFolder(id);
  if (folder) {
    folder.name = newName;
    await localforage.setItem(`folder:${id}`, folder);
    return folder;
  }
  return null;
}

export async function getFolder(id: string): Promise<Folder | null> {
  return await localforage.getItem<Folder>(`folder:${id}`);
}

export async function getAllFolders(): Promise<Folder[]> {
  const folders: Folder[] = [];
  await localforage.iterate((value, key) => {
    if (key.startsWith('folder:')) {
      folders.push(value as Folder);
    }
  });
  return folders;
}

// List Operations
export async function addList(folderId: string, content: string): Promise<List> {
  const id = await getNextId('list');
  const list: List = {
    id: `list${id}`,
    folderId,
    content
  };
  await localforage.setItem(`list:${list.id}`, list);
  return list;
}

export async function renameList(id: string, newContent: string): Promise<List | null> {
  const list = await getList(id);
  if (list) {
    list.content = newContent;
    await localforage.setItem(`list:${id}`, list);
    return list;
  }
  return null;
}

export async function getList(id: string): Promise<List | null> {
  return await localforage.getItem<List>(`list:${id}`);
}

export async function getListsByFolder(folderId: string): Promise<List[]> {
  const lists: List[] = [];
  await localforage.iterate((value, key) => {
    if (key.startsWith('list:')) {
      const list = value as List;
      if (list.folderId === folderId) {
        lists.push(list);
      }
    }
  });
  return lists;
}

// Task Operations
export async function addTask(listId: string, title: string, description?: string, tags?: string[], priority: 'low' | 'medium' | 'high' = 'medium'): Promise<Task> {
  const id = await getNextId('task');
  const task: Task = {
    id: `task${id}`,
    listId,
    title,
    description,
    done: false,
    tags,
    priority
  };
  await localforage.setItem(`task:${task.id}`, task);
  return task;
}

export async function getTask(id: string): Promise<Task | null> {
  return await localforage.getItem<Task>(`task:${id}`);
}

export async function getTasksByList(listId: string): Promise<Task[]> {
  const tasks: Task[] = [];
  await localforage.iterate((value, key) => {
    if (key.startsWith('task:')) {
      const task = value as Task;
      if (task.listId === listId) {
        tasks.push(task);
      }
    }
  });
  return tasks;
}

export async function updateTaskStatus(taskId: string, done: boolean): Promise<void> {
  const task = await getTask(taskId);
  if (task) {
    task.done = done;
    await localforage.setItem(`task:${taskId}`, task);
  }
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
  const task = await getTask(taskId);
  if (task) {
    const updatedTask = { ...task, ...updates };
    await localforage.setItem(`task:${taskId}`, updatedTask);
    return updatedTask;
  }
  return null;
}

// Delete Operations
export async function deleteFolder(id: string): Promise<void> {
  // First get all lists in this folder
  const lists = await getListsByFolder(id);
  
  // Delete all tasks in these lists
  for (const list of lists) {
    const tasks = await getTasksByList(list.id);
    for (const task of tasks) {
      await localforage.removeItem(`task:${task.id}`);
    }
    await localforage.removeItem(`list:${list.id}`);
  }
  
  // Finally delete the folder
  await localforage.removeItem(`folder:${id}`);

  // Reset folder_id_counter if no folders remain
  const folders = await getAllFolders();
  if (folders.length === 0) {
    await localforage.removeItem('folder_id_counter');
  }
}

export async function deleteList(id: string): Promise<void> {
  // First delete all tasks in this list
  const tasks = await getTasksByList(id);
  for (const task of tasks) {
    await localforage.removeItem(`task:${task.id}`);
  }
  
  // Then delete the list
  await localforage.removeItem(`list:${id}`);

  // Reset list_id_counter if no lists remain
  let anyListLeft = false;
  await localforage.iterate((_, key) => {
    if (key.startsWith('list:')) {
      anyListLeft = true;
      return false; // stop iteration
    }
  });
  if (!anyListLeft) {
    await localforage.removeItem('list_id_counter');
  }
}

export async function deleteTask(id: string): Promise<void> {
  await localforage.removeItem(`task:${id}`);

  // Reset task_id_counter if no tasks remain
  let anyTaskLeft = false;
  await localforage.iterate((_, key) => {
    if (key.startsWith('task:')) {
      anyTaskLeft = true;
      return false; // stop iteration
    }
  });
  if (!anyTaskLeft) {
    await localforage.removeItem('task_id_counter');
  }
} 