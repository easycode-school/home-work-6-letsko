import { Component, OnInit } from '@angular/core';
import { PostsService } from './../../services/posts.service';
import { Post } from './../../interfaces/post';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public appName = 'PostsApp';
  public totalPosts = 0;
  constructor(
    public postService: PostsService
  ) { }

  /**
   * Инициализирует значение общего количества постов и подписывает его на событие изменения массива постов.
   */
  ngOnInit() {
    this.postService.postsObservableSubject.subscribe((data: Post[]) => {
      this.totalPosts = data.length;
    }, (err) => { console.log(err); });
  }
}
