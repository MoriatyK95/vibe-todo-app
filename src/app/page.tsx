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
  const [currentView, setCurrentView] = useState<'calendar' | 'overview'>('calendar');

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

  const deleteTodo = (id: number, dateToUpdate?: string) => {
    const targetDate = dateToUpdate || selectedDate;
    const targetTodos = todosByDate[targetDate] || [];
    setTodosByDate(prev => ({
      ...prev,
      [targetDate]: targetTodos.filter((todo) => todo.id !== id)
    }));
  };

  const toggleTodo = (id: number, dateToUpdate?: string) => {
    const targetDate = dateToUpdate || selectedDate;
    const targetTodos = todosByDate[targetDate] || [];
    setTodosByDate(prev => ({
      ...prev,
      [targetDate]: targetTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };

  const getUpcomingTodos = () => {
    const today = new Date().toISOString().split('T')[0];
    const allTodos: (Todo & { dateDisplay: string })[] = [];
    
    Object.entries(todosByDate).forEach(([date, todos]) => {
      if (date >= today) {
        todos.forEach(todo => {
          const dateObj = new Date(date + 'T00:00:00');
          allTodos.push({
            ...todo,
            dateDisplay: dateObj.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })
          });
        });
      }
    });
    
    return allTodos.sort((a, b) => {
      if (a.date === b.date) {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return a.id - b.id;
      }
      return a.date.localeCompare(b.date);
    });
  };

  const getOverviewStats = () => {
    const upcoming = getUpcomingTodos();
    const completed = upcoming.filter(todo => todo.completed).length;
    const pending = upcoming.filter(todo => !todo.completed).length;
    const datesWithTodos = new Set(upcoming.map(todo => todo.date)).size;
    
    return { total: upcoming.length, completed, pending, datesWithTodos };
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
  const upcomingTodos = getUpcomingTodos();
  const stats = getOverviewStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Calendar Todo App
        </h1>
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                currentView === 'calendar'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setCurrentView('overview')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                currentView === 'overview'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              Overview
            </button>
          </div>
        </div>
        
        {currentView === 'calendar' && (
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
        )}

        {currentView === 'overview' && (
          <div>
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Total Todos</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
                <div className="text-sm text-green-600 dark:text-green-400">Completed</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.pending}</div>
                <div className="text-sm text-orange-600 dark:text-orange-400">Pending</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.datesWithTodos}</div>
                <div className="text-sm text-purple-600 dark:text-purple-400">Active Days</div>
              </div>
            </div>

            {/* Upcoming Todos List */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                Upcoming Todos
              </h2>
              
              {upcomingTodos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">📅</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No upcoming todos. Start planning your day!
                  </p>
                  <button
                    onClick={() => setCurrentView('calendar')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Go to Calendar
                  </button>
                </div>
              ) : (
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {upcomingTodos.map((todo) => (
                    <div
                      key={`${todo.date}-${todo.id}`}
                      className="flex items-center gap-4 p-3 bg-white dark:bg-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-550 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id, todo.date)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span
                          className={`block ${
                            todo.completed
                              ? "line-through text-gray-500 dark:text-gray-400"
                              : "text-gray-800 dark:text-white"
                          }`}
                        >
                          {todo.text}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {todo.dateDisplay}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDate(todo.date);
                          setCurrentView('calendar');
                        }}
                        className="px-2 py-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded text-sm"
                        title="View in calendar"
                      >
                        📅
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id, todo.date)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
