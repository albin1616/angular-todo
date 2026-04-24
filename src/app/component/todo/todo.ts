import { Component, signal, computed, effect } from '@angular/core';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo {
  todos = signal<TodoItem[]>(this.loadFromStorage());
  filter = signal<'all' | 'active' | 'completed'>('all');
  newTodoText = signal('');
  editingId = signal<number | null>(null);
  editText = signal('');

  filteredTodos = computed(() => {
    const currentFilter = this.filter();
    const allTodos = this.todos();
    
    switch (currentFilter) {
      case 'active':
        return allTodos.filter(todo => !todo.completed);
      case 'completed':
        return allTodos.filter(todo => todo.completed);
      default:
        return allTodos;
    }
  });

  constructor() {
    effect(() => {
      this.saveToStorage(this.todos());
    });
  }

  private loadFromStorage(): TodoItem[] {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('todos');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  private saveToStorage(todos: TodoItem[]): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }

  addTodo(): void {
    const text = this.newTodoText().trim();
    if (text) {
      const newTodo: TodoItem = {
        id: Date.now(),
        text,
        completed: false
      };
      this.todos.update(current => [...current, newTodo]);
      this.newTodoText.set('');
    }
  }

  deleteTodo(id: number): void {
    this.todos.update(current => current.filter(todo => todo.id !== id));
  }

  toggleTodo(id: number): void {
    this.todos.update(current =>
      current.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  startEdit(id: number, text: string): void {
    this.editingId.set(id);
    this.editText.set(text);
  }

  saveEdit(id: number): void {
    const newText = this.editText().trim();
    if (newText) {
      this.todos.update(current =>
        current.map(todo =>
          todo.id === id ? { ...todo, text: newText } : todo
        )
      );
    }
    this.editingId.set(null);
    this.editText.set('');
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editText.set('');
  }

  setFilter(filter: 'all' | 'active' | 'completed'): void {
    this.filter.set(filter);
  }
}
