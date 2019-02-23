import { Injectable } from '@angular/core';
import { Post } from './../interfaces/post';
import { BehaviorSubject, Observable } from 'rxjs';
import { RequestsService } from './../services/requests.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  // posts
  public posts: Post[] = [];
  private _postSource = new BehaviorSubject(this.posts);
  public postsObservableSubject = this._postSource.asObservable();

  // editable post
  private _currentPost: Post = {
    id: 0,
    userId: '',
    title: '',
    body: '',
    comments: []
  };
  private _currentPostSource = new BehaviorSubject(this._currentPost);
  public currentPostObservableSubject = this._currentPostSource.asObservable();

  // form
  public postFormName = 'submit';
  public buttonName = 'Create';

  // editing status
  public editingStatus = false;

  constructor(
    public requestsService: RequestsService
  ) { }

  /**
   * getPosts:
   *    1. Возвращает массив постов от сервера;
   *    2. Записывает его в массив постов в сервисе;
   *    3. Распространяет событие обновления массива постов на всех подписчиков этого события.
   */
  public getPosts(): Observable<Object> {
    return this.requestsService.getPosts().pipe(
      map((posts: Post[]): Post[] => {
        this.posts = posts;
        this._postSource.next(posts);
        return posts;
      })
    );
  }

  /**
   * addPost - добавляет новый пост
   * @param post - объект нового поста
   * Добавляет пост в массив постов;
   * Распространяет событие обновления массива постов на подписчиков.
   */
  private addPost(post: Post): void {
    this.posts.push(Object.assign({}, post));
    this._postSource.next(this.posts);
  }

  /**
   * changeFormOptions:
   *    1. меняет значение редактирование
   *    (если есть какой-то пост на редактировании - true, если нет - false);
   *    2. Меняет значение в раметке формы в зависимости от статуса редактирования.
   */
  public changeFormOptions() {
    this.editingStatus = !this.editingStatus;
    this.postFormName = this.editingStatus ? 'edit' : 'submit';
    this.buttonName = this.editingStatus ? 'Edit' : 'Create';
  }

  /**
   * submitPost: если значение редактирвоания false - вызывает функцию отправки нового поста,
   *             если оно true - вызывает функцию отправки отредактированного поста.
   * @param title - заголовок поста
   * @param body - текст поста
   */
  public submitPost(title: string, body: string) {
    if (!this.editingStatus) {
      this.submitNewPost(title, body);
    } else {
      this.submitEditing(title, body);
    }
  }

  /**
   * submitPost:
   *    1. Генерирует новый пост на основе полученных  - добавляет в него id поста и id пользователя;
   *    2. Делает запрос к серверу на добавление поста;
   *    3. Добавляет пост в массив постов.
   * @param title - заголовок нового поста;
   * @param body - текст нового поста.
   */
  public submitNewPost(title: string, body: string): void {
    const newPost: Post = {
      id: (this.posts.length !== 0) ? this.posts[this.posts.length - 1].id + 1 : 1,
      userId: 'guest',
      title: title,
      body: body
    };

    this.requestsService.sendPost(newPost).subscribe((post: Post) => {
      this.addPost(newPost);
    });
  }

  /**
   * onEditPost:
   *    1. Меняет параметры формы;
   *    2. Присваивает значение редактироуемого поста в наблюдаемый объект редактирумого поста;
   *    3. Распространяет значение редактирумого поста наблюдателям.
   * @param post - объект поста
   */
  public editPost(post: Post) {
    this.changeFormOptions();
    this._currentPost = post;
    this._currentPostSource.next(this._currentPost);
  }

  /**
   * onSubmitEditing:
   *    1. Присваивает значения title и body в соотетствующие поля объекта редактируемого поста;
   *    2. Делает запрос на обновление поста;
   *    3. Меняет параметры формы.
   * @param title - новый заголовок поста
   * @param body - новый текст поста
   */
  public submitEditing(title: string, body: string): void {
    this._currentPost.title = title;
    this._currentPost.body = body;
    this.requestsService.updatePost(this._currentPost);
    this.changeFormOptions();
  }

  /**
   * deletePost:
   *    1. Отправляет запрос к серверу на удаление поста;
   *    2. Удаляет пост из массива постов;
   *    3. Распространяет событие обновления массива постов на подписчиков.
   * @param postId - id удаляемого поста
   */
  public deletePost(post: Post): void {
    this.requestsService.deletePost(post.id);
    this.posts.splice(this.posts.indexOf(post), 1);
    this._postSource.next(this.posts);
  }
}
