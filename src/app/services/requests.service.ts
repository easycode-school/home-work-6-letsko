import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Post } from './../interfaces/post';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private _apiUrl: string = environment.apiUrl;

  constructor(
    private _http: HttpClient,

  ) { }

  /**
   * getPosts - делает запрос к серверу на получение массива всех постов
   */
  public getPosts(): Observable<Object> {
    return this._http.get(`${this._apiUrl}/posts`);
  }

  /**.sendPost
   * getComments- делает запрос к серверу на получение массива всех комментариев
   */
  public getComments(id: number): Observable<Object> {
    return this._http.get(`${this._apiUrl}/comments?postId=${id}`);
  }

  /**
   * sendPost:
   *    1. Создает объект параметров запроса;
   *    2. Делает запрос к серверу на добавление нового поста.
   * @param post - объект нового поста
   */
  public sendPost(post: Post): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };

    return this._http.post(`${this._apiUrl}/posts`, post, httpOptions);
  }

  /**
   * updatePost:
   *    1. Создает объект параметров запроса;
   *    2. Делает запрос к серверу на обновление поста.
   * @param updatedPost - обновленный пост.
   */
  public updatePost(updatedPost: Post): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    };

    return this._http.put(`${this._apiUrl}/posts/${updatedPost.id}`, updatedPost, httpOptions);
  }

  /**
   * deletePost - Делает запрос к серверу на удаление поста.
   * @param postId - id удаляемого поста.
   */
  public deletePost(postId: number): Object {
    return this._http.delete(`${this._apiUrl}/posts/${postId}`).subscribe();
  }
}
