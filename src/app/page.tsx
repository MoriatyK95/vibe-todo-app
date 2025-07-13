"use client";

import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string;
}

export default function Home() {
  const [todosByDate, setTodosByDate] = useState<Record<string, Todo[]>>({});
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getCurrentTodos = () => todosByDate[selectedDate] || [];

  const addTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        date: selectedDate,
      };
      
      setTodosByDate(prev => ({
        ...prev,
        [selectedDate]: [...getCurrentTodos(), newTodo]
      }));
      setInputValue("");
    }
  };

  const deleteTodo = (id: number) => {
    setTodosByDate(prev => ({
      ...prev,
      [selectedDate]: getCurrentTodos().filter((todo) => todo.id !== id)
    }));
  };

  const toggleTodo = (id: number) => {
    setTodosByDate(prev => ({
      ...prev,
      [selectedDate]: getCurrentTodos().map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };

  const generateCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar = [];
    const current = new Date(startDate);
    
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = current.toISOString().split('T')[0];
        const isCurrentMonth = current.getMonth() === month;
        const isToday = dateStr === new Date().toISOString().split('T')[0];
        const isSelected = dateStr === selectedDate;
        const hasTodos = todosByDate[dateStr] && todosByDate[dateStr].length > 0;
        
        weekDays.push({
          date: new Date(current),
          dateStr,
          day: current.getDate(),
          isCurrentMonth,
          isToday,
          isSelected,
          hasTodos
        });
        current.setDate(current.getDate() + 1);
      }
      calendar.push(weekDays);
      if (current.getMonth() !== month && week >= 4) break;
    }
    
    return calendar;
  };

  const formatSelectedDate = () => {
    const date = new Date(selectedDate + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const currentTodos = getCurrentTodos();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Calendar Todo App
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            
            {/* Calendar Grid */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-300 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              {generateCalendar().map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                  {week.map((day) => (
                    <button
                      key={day.dateStr}
                      onClick={() => setSelectedDate(day.dateStr)}
                      className={`
                        relative p-2 text-sm rounded-md transition-colors
                        ${!day.isCurrentMonth 
                          ? 'text-gray-400 dark:text-gray-500' 
                          : 'text-gray-700 dark:text-gray-200'
                        }
                        ${day.isToday 
                          ? 'bg-blue-100 dark:bg-blue-900 font-bold' 
                          : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                        }
                        ${day.isSelected 
                          ? 'bg-blue-500 text-white hover:bg-blue-600' 
                          : ''
                        }
                      `}
                    >
                      {day.day}
                      {day.hasTodos && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Todo Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Todos for {formatSelectedDate()}
            </h2>
            
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new todo..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={addTodo}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>

            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {currentTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span
                    className={`flex-1 ${
                      todo.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : "text-gray-800 dark:text-white"
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            {currentTodos.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
                No todos for this day yet. Add one above!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
