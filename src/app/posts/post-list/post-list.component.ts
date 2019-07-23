import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {PageEvent} from '@angular/material';

import {Post} from '../post.model';
import {PostsService} from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  @ViewChild('paginator') paginator: any;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      if (this.totalPosts - 1 - (this.postPerPage * (this.currentPage - 1)) <= 0) {
        this.currentPage = (this.currentPage === 1) ? 1 : this.currentPage - 1;
        this.paginator.pageIndex = this.currentPage - 1;
        this.totalPosts = (this.totalPosts === 0) ? 0 : this.totalPosts - 1;
        this.paginator.page.next({
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize,
          length: this.totalPosts
        });
      }
      this.postsService.getPosts(this.postPerPage, this.currentPage);
    });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

}
