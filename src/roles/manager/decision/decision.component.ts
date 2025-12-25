import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IdeaService } from '../../../services/idea.service';
import { Idea, Review } from '../../../models/model';

@Component({
  selector: 'app-decision',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './decision.component.html',
  styleUrl: './decision.component.css',
})
export class DecisionComponent implements OnInit {
  ideas: Idea[] = [];
  selected: Idea | null = null;
  feedback = '';
  decision: 'Approve' | 'Reject' = 'Approve';
  reviews: Review[] = [];
  currentUserID = 0;
  currentUserName = '';
  comments: import('../../../models/model').Comment[] = [];

  constructor(
    private route: ActivatedRoute,
    private ideaService: IdeaService
  ) {}

  ngOnInit(): void {
    // load user
    try {
      const raw = window.localStorage.getItem('currentUser');
      const u = raw ? JSON.parse(raw) : null;
      if (u && u.userID) {
        this.currentUserID = u.userID;
        this.currentUserName = u.name || '';
      }
    } catch {}

    this.ideaService.getAllIdeas().subscribe((list) => (this.ideas = list));

    // react to query param changes (e.g. opened from manager dashboard link)
    this.route.queryParamMap.subscribe((q) => {
      const id = Number(q.get('id'));
      if (id) {
        const found = this.ideas.find((i) => i.ideaID === id);
        if (found) this.select(found);
      }
    });
  }

  select(idea: Idea | null) {
    this.selected = idea;
    if (idea) {
      this.reviews = this.ideaService.getReviewsForIdea(idea.ideaID);
      this.comments = this.ideaService.getCommentsForIdea(idea.ideaID);
    }
  }

  submitReview() {
    if (!this.selected) return;
    this.ideaService.addReview({
      ideaID: this.selected.ideaID,
      reviewerID: this.currentUserID,
      reviewerName: this.currentUserName,
      feedback: this.feedback,
      decision: this.decision,
    });
    this.feedback = '';
    this.reviews = this.ideaService.getReviewsForIdea(this.selected.ideaID);
  }
}
