import { Component } from '@angular/core';
import { HomeService } from '../services/home.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  comments: any[] = [];
  filteredComments: any[] = [];
  displayedComments: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchQuery: string = '';
  sortColumn: string = '';
  sortType: string = 'asc';

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.getComments().subscribe((data) => {
      this.comments = data;
      this.filteredComments = data;
      this.paginate();
    });
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedComments =this.filteredComments.slice(start, end);
  }

  search(): void {
    this.filteredComments = this.comments.filter(
      (comment) =>
        comment.email.includes(this.searchQuery) ||
        comment.name.includes(this.searchQuery) || 
        comment.body.includes(this.searchQuery)
    );
    this.paginate();
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortType = this.sortType === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortType = 'asc';
    }

    this.comments.sort((a, b) => {
      let compare = 0;
      if (a[column] > b[column]) compare = 1;
      if (a[column] < b[column]) compare = -1;
      return this.sortType === 'asc' ? compare : -compare;
    });

    this.paginate();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.paginate();
  }

  changePerPageChange(event: Event): void {
    const value = parseInt((event.target as HTMLSelectElement).value,10);
    this.itemsPerPage = value == -1 ? this.comments.length : value;
    this.currentPage = 1; 
    this.paginate();
  }
}
