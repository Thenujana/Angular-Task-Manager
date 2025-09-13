import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  assignedUserId: number;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UserComponent {
  // Kanban columns
  columns = [
    { title: 'To-Do', status: 'PENDING', tasks: [] as Task[] },
    { title: 'In Progress', status: 'IN_PROGRESS', tasks: [] as Task[] },
    { title: 'Completed', status: 'COMPLETED', tasks: [] as Task[] }
  ];

  constructor() {
    // Example tasks
    this.columns[0].tasks.push(
      { id: 1, title: 'Design Login Page', description: 'Create UI for login', status: 'PENDING', assignedUserId: 101 },
      { id: 2, title: 'Set up Database', description: 'Initialize PostgreSQL DB', status: 'PENDING', assignedUserId: 102 }
    );
  }

  // Drag-drop handler
  drop(event: CdkDragDrop<Task[]>, columnIndex: number) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update task status automatically when moved
      const movedTask = event.container.data[event.currentIndex];
      movedTask.status = this.columns[columnIndex].status;
    }
  }

  // Returns array of connected drop lists for cross-column drag
  getConnectedLists(currentIndex: number): string[] {
    return this.columns
      .map((_, index) => 'cdk-drop-list-' + index)
      .filter((_, index) => index !== currentIndex);
  }
}
