// (no-op)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IdeaService } from '../../../services/idea.service';
import { Idea, Comment as IdeaComment, User } from '../../../models/model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  ideas: Idea[] = [];
  selected: Idea | null = null;
  comments: IdeaComment[] = [];
  reviews: import('../../../models/model').Review[] = [];
  newComment = '';
  currentUser: User | null = null;

  constructor(private ideaService: IdeaService) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.ideaService.getAllIdeas().subscribe((list) => {
      this.ideas = list;
      if (!this.selected && this.ideas.length) {
        // keep selection empty until user clicks
      }
    });

    // seed with demo content when empty (sets submittedBy to current user id or 0)
    this.ideaService.seedIfEmpty(this.currentUser?.userID || 0);
  }

  loadCurrentUser() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem('currentUser');
        this.currentUser = raw ? JSON.parse(raw) : null;
      }
    } catch {
      this.currentUser = null;
    }
  }

  selectIdea(idea: Idea) {
    this.selected = idea;
    this.comments = this.ideaService.getCommentsForIdea(idea.ideaID);
    this.reviews = this.ideaService.getReviewsForIdea(idea.ideaID);
  }

  addComment() {
    if (!this.selected || !this.currentUser || !this.newComment.trim()) return;
    this.ideaService.addComment({
      ideaID: this.selected.ideaID,
      userID: this.currentUser.userID,
      text: this.newComment.trim(),
      createdDate: new Date().toISOString(),
      userName: this.currentUser.name,
    });
    this.newComment = '';
    this.comments = this.ideaService.getCommentsForIdea(this.selected.ideaID);
  }

  upvote(idea: Idea) {
    if (!this.currentUser) return;
    this.ideaService.vote(idea.ideaID, this.currentUser.userID, 'Upvote');
  }

  downvote(idea: Idea) {
    if (!this.currentUser) return;
    this.ideaService.vote(idea.ideaID, this.currentUser.userID, 'Downvote');
  }
}
