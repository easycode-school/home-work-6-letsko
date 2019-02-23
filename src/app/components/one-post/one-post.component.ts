import { Component, OnInit, Input } from '@angular/core';
import { PostsService } from './../../services/posts.service';
import { RequestsService } from './../../services/requests.service';
import { Post } from './../../interfaces/post';
import { Comment } from '@angular/compiler';

@Component({
  selector: 'app-one-post',
  templateUrl: './one-post.component.html',
  styleUrls: ['./one-post.component.css']
})
export class OnePostComponent implements OnInit {
  @Input() post: Post;

  public postCommentState = false;
  public comments: Comment[];
  public currentPost: Post = this.post;

  constructor(
    private postService: PostsService,
    private requestsService: RequestsService
  ) { }

  ngOnInit() { }

  /**
   * onCommentsToggle:
   *    1. Меняет значение, отвечающее за видимость комментариев;
   *    2. Проверяет значение видимости комментариев и если оно true - делает запрос к серверу для их получения;
   *    3. Полученные комментарии складывает в переменную this.comments.
   */
  private onCommentsToggle(postId: number): void {
    this.postCommentState = !this.postCommentState;

    if (this.postCommentState) {
      this.requestsService.getComments(postId).subscribe((comments: Comment[]) => {
        this.comments = comments;
      }, (err) => console.log(err));
    }
  }

  /**
   * onEditPost - вызывает метод в сервисе, инициирующий передачу значений в форму
   * @param post - объект поста
   */
  private onEditPost(post: Post): void {
    this.postService.editPost(post);
  }

  /**
   * onDeletePost - вызывает метод в сервисе, инициирующий удаление поста
   * @param post - объект поста
   */
  private onDeletePost(post: Post): void {
    this.postService.deletePost(post);
  }
}
