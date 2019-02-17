import { Component, OnInit, Input } from '@angular/core';
import { PostsService } from './../../services/posts.service';
import { Post } from './../../interfaces/post';

@Component({
  selector: 'app-one-post',
  templateUrl: './one-post.component.html',
  styleUrls: ['./one-post.component.css']
})
export class OnePostComponent implements OnInit {
  @Input() post: Post;

  public postCommentState = false;
  public currentPost: Post = this.post;

  constructor(
    public postService: PostsService
  ) { }

  ngOnInit() { }

  /**
   * onCommentsToggle - меняет значение, отвечающее за видимость постов.
   */
  public onCommentsToggle(): void {
    this.postCommentState = !this.postCommentState;
  }
}
