import { Component, OnInit } from '@angular/core';
import { PostsService } from './../../services/posts.service';
import { Post } from './../../interfaces/post';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  public posts: Post[] = this.postService.posts;
  constructor(
    public postService: PostsService
  ) { }

  /**
   * Получает массив постов в компоненту
   */
  ngOnInit() {
    this.postService.getPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
    }, (err) => console.log(err));
  }
}
