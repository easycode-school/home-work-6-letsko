import { Component, OnInit } from '@angular/core';
import { PostsService } from './../../services/posts.service';
import { Post } from './../../interfaces/post';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  public posts: Post[] = [];
  constructor(
    public postService: PostsService
  ) { }

  /**
   * Инициализирует посты в PostService и забирает их в компоненту после инициализации.
   */
  ngOnInit() {
    this.postService.initPosts();
    this.postService.postsObservableSubject.subscribe((data: Post[]) => {
      this.posts = data;
    }, (err) => console.log(err));

    this.postService.initComments();
  }
}
