'use client'

import React from "react";
import Button from "../../../shared/ui";

export const ToDoListPage: React.FC = () => {
  const [tasks, setTasks] = React.useState(() => {
    const storedTasks = window.localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [isEditing, setIsEditing] = React.useState({
    isEditing: false,
    taskId: null as number | null,
  });

  const [title, setTitle] = React.useState<string>("");

  const [newTaskTitle, setNewTaskTitle] = React.useState<string>("");

  const [error, setError] = React.useState<string | null>(null);

  const [isDisabled, setIsDisabled] = React.useState<boolean>(true);

  const [isHaveSelected, setIsHaveSelected] = React.useState<boolean>(false);

  const [selectedTasks, setSelectedTasks] = React.useState<number[]>([]);

  React.useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  { /* Task Addition Functionality */ }
  const addTask = (taskTitle: string) => {
    console.log("Adding task:", taskTitle);
    setTasks((prevTasks: { id: number; title: string; completed: boolean }[]) => [...prevTasks, { id: prevTasks.length + 1, title: taskTitle, completed: false }]);
  };

  { /* Task Editing Functionality */ }
  const editTask = (taskId: number, newTitle: string) => {
    console.log("Editing task:", taskId, newTitle);
    setTasks((prevTasks: { id: number; title: string; completed: boolean }[]) => prevTasks.map(task => task.id === taskId ? { ...task, title: newTitle } : task));
  };

  { /* Task Deletion Functionality */ }
  const deleteTask = (taskId: number) => {
    console.log("Deleting task:", taskId);
    setTasks((prevTasks: { id: number; title: string; completed: boolean }[]) => prevTasks.filter(task => task.id !== taskId));
  };

  { /* Task Completion Toggle Functionality */ }
  const taskCompleted = (taskId: number) => {
    console.log("Toggling task completion:", taskId);
    setTasks((prevTasks: { id: number; title: string; completed: boolean }[]) => prevTasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
  };

  return (
    <div className="w-full flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col gap-4 items-center justify-center flex-1 w-full px-20 text-center">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold text-black dark:text-white">
            Aplikasi Daftar Tugas
          </h1>
          <form className="flex flex-col items-center justify-center mt-6 gap-5" onSubmit={(e) => { e.preventDefault(); }}>
            <input
              type="text"
              placeholder="Tambah tugas baru..."
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                if (e.target.value.trim()) {
                  setTitle(e.target.value);
                  setError(null);
                  setIsDisabled(false);
                } else {
                  setTitle("");
                  setError("Title tidak boleh kosong!");
                  setIsDisabled(true);
                }
              }}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button variant="primary" isDisabled={isDisabled} onClick={() => {
              if (title.trim()) {
                addTask(title);
                setTitle("");
                setError(null);
              }
            }}>
              Tambah Tugas
            </Button>
          </form>
        </div>
        <div className="w-full flex flex-row items-center justify-center mt-6">
            <div className="flex flex-col items-center justify-center mr-4">
                <h2 className="text-4xl font-bold text-black dark:text-white">
                    Tugas belum Selesai
                </h2>
                {
                    isHaveSelected ? (
                        <div className="flex flex-row items-center justify-center gap-2 mt-2">
                            <p className="text-black dark:text-white">Task terpilih: {selectedTasks.length}</p>
                            <Button variant="danger" onClick={() => {
                                selectedTasks.forEach(taskId => deleteTask(taskId));
                                setSelectedTasks([]);
                                setIsHaveSelected(false);
                            }}>Hapus Task Terpilih</Button>
                            <Button variant="success" onClick={() => {
                                selectedTasks.forEach(taskId => taskCompleted(taskId));
                                setSelectedTasks([]);
                                setIsHaveSelected(false);
                            }}>Selesaikan Task Terpilih</Button>
                        </div>
                    ) : null
                }
                {
                    tasks.filter((task: { completed: boolean; }) => !task.completed).map((task: {
                        completed: boolean; id: number; title: string 
                }) => (
                        <div key={task.id} className="relative flex flex-col items-center justify-between w-full mt-2 gap-5 bg-blue-50 dark:bg-gray-800 p-4 rounded-md">
                            <div className="absolute top-2 left-2">
                                <input
                                    type="checkbox"
                                    checked={selectedTasks.includes(task.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedTasks([...selectedTasks, task.id]);
                                            setIsHaveSelected(true);
                                        } else {
                                            const updatedSelectedTasks = selectedTasks.filter(id => id !== task.id);
                                            setSelectedTasks(updatedSelectedTasks);
                                            if (updatedSelectedTasks.length === 0) {
                                                setIsHaveSelected(false);
                                            }
                                        }
                                    }}
                                />
                            </div>
                            {
                                isEditing.taskId === task.id && isEditing.isEditing ? (
                                    <div key={task.id} className="flex flex-row items-center justify-between gap-2">
                                        <span className="text-black dark:text-white">{task.title}</span>
                                        <input
                                            type="text"
                                            placeholder="Edit task title..."
                                            onChange={(e) => {
                                                setNewTaskTitle(e.target.value);
                                                setError(null);
                                            }}
                                            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <Button variant="primary" onClick={() => {
                                            editTask(task.id as number, newTaskTitle);
                                            setIsEditing({ isEditing: false, taskId: null });
                                        }}>Save</Button>
                                    </div>
                                ) : <span className="text-black dark:text-white">{task.title}</span>
                            }
                            <div className="flex flex-row items-center justify-between gap-2">
                                <Button variant="secondary" onClick={() => {
                                    setIsEditing({ isEditing: true, taskId: task.id });
                                    setNewTaskTitle(task.title as string);
                                }}>Edit</Button>
                                <Button variant="success" onClick={() => taskCompleted(task.id as number)}>Complete</Button>
                                <Button variant="danger" onClick={() => deleteTask(task.id as number)}>Delete</Button>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="-w-full flex flex-col items-center justify-center ml-4">
                <h2 className="text-4xl font-bold text-black dark:text-white">
                    Tugas yang Selesai
                </h2>
                {
                    isHaveSelected ? (
                        <div className="flex flex-row items-center justify-center gap-2 mt-2">
                            <p className="text-black dark:text-white">Task terpilih: {selectedTasks.length}</p>
                            <Button variant="danger" onClick={() => {
                                selectedTasks.forEach(taskId => deleteTask(taskId));
                                setSelectedTasks([]);
                                setIsHaveSelected(false);
                            }}>Hapus Task Terpilih</Button>
                            <Button variant="success" onClick={() => {
                                selectedTasks.forEach(taskId => taskCompleted(taskId));
                                setSelectedTasks([]);
                                setIsHaveSelected(false);
                            }}>Undo Task Terpilih</Button>
                        </div>
                    ) : null
                }
                {
                    tasks.filter((task: { completed: boolean; }) => task.completed).map((task: { id: number; title: string }) => (
                        <div key={task.id} className="relative flex flex-col items-center justify-between w-full mt-2 gap-5 bg-green-50 dark:bg-gray-800 p-4 rounded-md">
                            <div className="absolute top-2 left-2">
                                <input
                                    type="checkbox"
                                    checked={selectedTasks.includes(task.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedTasks([...selectedTasks, task.id]);
                                            setIsHaveSelected(true);
                                        } else {
                                            const updatedSelectedTasks = selectedTasks.filter(id => id !== task.id);
                                            setSelectedTasks(updatedSelectedTasks);
                                            if (updatedSelectedTasks.length === 0) {
                                                setIsHaveSelected(false);
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <span className="text-black dark:text-white">{task.title}</span>
                            <div className="flex flex-row items-center justify-between gap-2">
                                <Button variant="danger" onClick={() => deleteTask(task.id as number)}>Delete</Button>
                                <Button variant="success" onClick={() => taskCompleted(task.id as number)}>Undo</Button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
      </main>
    </div>
  );
};