
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../service/task.service';
import { Task } from '../../models/task';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task-page',
  standalone: true,
  templateUrl: './add-task-page.component.html',
  styleUrls: ['./add-task-page.component.css'],
  imports: [CommonModule,ReactiveFormsModule]
})
export class AddTaskPageComponent implements OnInit {
  taskForm!: FormGroup;

  constructor(private fb: FormBuilder, private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      assignedUserId: [null, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const newTask: Task = this.taskForm.value;

      this.taskService.createTask(newTask).subscribe({
        next: (task) => {
          console.log('Task created:', task);
          alert('Task created successfully!');
        },
        error: (err) => {
          console.error('Error creating task:', err);
          alert('Error!');

        }
      });
    } else {
      this.taskForm.markAllAsTouched(); 
      alert('Fill the fields properly!');

    }
  }
}
