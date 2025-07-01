import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task';
import { TaskService } from '../../service/task.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, ReactiveFormsModule, HttpClientModule,RouterModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  taskForm: FormGroup;
  showModal = false;
  isEditMode = false;
  currentTaskId: number | null = null;
  searchTerm = '';
  statusFilter = 'ALL';

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      assignedUserId: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.filterTasks();
    });
  }

  filterTasks(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === 'ALL' || task.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  formatStatus(status: string): string {
    return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  getStatusClass(status: string): string {
    return `task-card-${status.toLowerCase().replace('_', '-')}`;
  }

  showAddTaskForm(): void {
    this.isEditMode = false;
    this.currentTaskId = null;
    this.taskForm.reset({ status: '' });
    this.showModal = true;
  }

  editTask(task: Task): void {
    this.isEditMode = true;
    this.currentTaskId = task.id;
    this.taskForm.setValue({
      title: task.title,
      description: task.description,
      status: task.status,
      assignedUserId: task.assignedUserId
    });
    this.showModal = true;
  }

  hideModal(): void {
    this.showModal = false;
  }

  saveTask(): void {
    if (this.taskForm.valid) {
      const formData = this.taskForm.value;

      if (this.isEditMode && this.currentTaskId !== null) {
        this.taskService.updateTask(this.currentTaskId, formData).subscribe(() => {
          this.fetchTasks();
          this.hideModal();
        });
      } else {
        this.taskService.createTask(formData).subscribe(() => {
          this.fetchTasks();
          this.hideModal();
        });
      }
    }
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.fetchTasks();
      });
    }
  }
}
