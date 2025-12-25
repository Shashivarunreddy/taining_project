import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IdeaService } from '../../../services/idea.service';
import { UserRole } from '../../../models/model';

@Component({
  selector: 'app-createidea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './createidea.component.html',
  styleUrl: './createidea.component.css',
})
export class CreateideaComponent implements OnInit {
  form!: FormGroup;

  currentRole: UserRole | null = null;
  currentUserId = 0;

  constructor(
    private fb: FormBuilder,
    private ideaService: IdeaService,
    private router: Router
  ) {
    // Initialize form here to avoid using 'fb' before constructor runs
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: [''],
      status: ['UnderReview'],
    });
  }

  ngOnInit(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem('currentUser');
        const u = raw ? JSON.parse(raw) : null;
        if (u) {
          this.currentRole = u.role;
          this.currentUserId = u.userID;
        }
      }
    } catch {}
  }

  submit() {
    if (this.form.invalid) return;

    const payload: any = {
      title: this.form.value.title,
      description: this.form.value.description,
      category: this.form.value.category,
      submittedByUserID: this.currentUserId,
      submittedDate: new Date().toISOString(),
      status: 'UnderReview',
    };

    // Only manager can set to Draft/Approved
    if (
      this.currentRole === UserRole.MANAGER &&
      (this.form.value.status === 'Draft' ||
        this.form.value.status === 'Approved')
    ) {
      payload.status = this.form.value.status;
    }

    this.ideaService.createIdea(payload);
    this.router.navigate(['employee/dashboard']);
  }
}
