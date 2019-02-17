import { Injectable } from '@angular/core';
import { Post } from './../interfaces/post';
import { Comment } from './../interfaces/comment';
import { BehaviorSubject } from 'rxjs';
import { RequestsService } from './../services/requests.service';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  // posts
  private _posts: Post[] = [];
  private _postSource = new BehaviorSubject(this._posts);
  public postsObservableSubject = this._postSource.asObservable();

  // editable post
  public _currentPost: Post = {
    id: 0,
    userId: '',
    title: '',
    body: '',
    comments: []
  };
  private _currentPostSource = new BehaviorSubject(this._currentPost);
  public currentPostObservableSubject = this._currentPostSource.asObservable();

  // comments
  private _comments: Comment[] = [];
  public commentsToCurrentPost: Comment[] = [];

  // form
  public postFormName = 'submit';
  public buttonName = 'Create';

  constructor(
    public requestsService: RequestsService
  ) { }

  /**
   * initPosts: 1. Обращается к серверу для получения постов;
   *            2. Полученные данные присваивает в массив постов;
   *            3. Распространяет событие обновления массива постов на всех подписчиков.
   */
  public initPosts(): void {
    this.requestsService.getPosts().subscribe((data: Post[]) => {
      this._posts = data;
      this._postSource.next(this._posts);
    }, (err) => { console.log(err); });
  }

  /**
   * initComments: 1. Обращается к серверу для получения комментариев;
   *               2. Полученные данные присваивает в масисв комментариев;
   *               3. Перебирает массив постов и для каждого поста делает выборку из комментариев, которые соответствуют этому посту.
   */
  initComments(): void {
    this.requestsService.getComments().subscribe((components: Comment[]) => {
      this._comments = components;

      this._posts.forEach((post: Post) => {
        this.commentsToCurrentPost = this._comments.filter((comment: Comment) => {
          return comment.postId === post.id;
        });
        post.comments = this.commentsToCurrentPost;
      });
    }, (err) => { console.log(err); });
  }

  /**
   * addPost - добавляет новый пост
   * @param post - объект нового поста
   * Добавляет пост в массив постов;
   * Распространяет событие обновления массива постов на подписчиков.
   */
  public addPost(post: Post): void {
    this._posts.push(Object.assign({}, post));
    this._postSource.next(this._posts);
  }

  /**
   * submitPost:
   *    1. Деоает проверку полей формы, если они пусты - позвращает сообщение о том, что их нужно заполнить;
   *    2. Генерирует новый пост - добавляет в него id поста и id пользователя;
   *    3. Делает запрос к серверу на добавление поста;
   *    4. Добавляет пост в массив постов;
   *    5. Обнуляет форму.
   * @param form - объект нового поста, полученный из формы
   */
  public submitPost(form: NgForm): void {
    if (!form.value.title || !form.value.title) {
      return console.log('Enter title and text');
    }

    const newPost: Post = {
      id: (this._posts.length !== 0) ? this._posts[this._posts.length - 1].id + 1 : 1,
      userId: 'guest',
      title: form.value.title,
      body: form.value.body,
      comments: []
    };

    this.requestsService.sendPost(newPost).subscribe((post: Post) => {
      this.addPost(newPost);
      form.reset();
    });
  }

  /**
   * onEditPost:
   *    1. Присвает имени формы значение 'edit';
   *    2. Присваивает кнопке отправки формы имя 'Edit';
   *    3. Присваивает значение редактироуемого поста в наблюдаемый объект редактирумого поста;
   *    4. Распространяет значение редактирумого поста наблюдателям.
   * @param post - объект поста
   */
  public onEditPost(post: Post) {
    this.postFormName = 'edit';
    this.buttonName = 'Edit';
    this._currentPost = post;
    this._currentPostSource.next(this._currentPost);
  }

  /**
   * onSubmitEditing:
   *    1. Присваивает значения title и body в соотетствующие поля объекта редактируемого поста;
   *    2. Делает запрос на обновление поста;
   *    3. Присвает имени формы значение 'submit';
   *    4. Присваивает кнопке отправки формы имя 'Create'.
   * @param title - новый заголовок поста
   * @param body - новый текст поста
   */
  public onSubmitEditing(title: string, body: string): void {
    this._currentPost.title = title;
    this._currentPost.body = body;

    this.requestsService.updatePost(this._currentPost).subscribe(() => {
      this.postFormName = 'submit';
      this.buttonName = 'Create';
    }, (err) => { console.log(err); });
  }

  /**
   * deletePost - удаляет пост
   * @param postId - id удаляемого поста
   * Отправляет запрс к серверу на удаление поста;
   * Удаляет пост из массива постов;
   * Распространяет событие обновления массива постов на подписчиков.
   */
  public deletePost(postId: number): void {
    this.requestsService.deletePost(postId);
    this._posts = this._posts.filter(post => post.id !== postId);
    this._postSource.next(this._posts);
  }

}
