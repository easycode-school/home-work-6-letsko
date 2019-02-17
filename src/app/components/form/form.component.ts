import { Component, OnInit } from '@angular/core';
import { PostsService } from './../../services/posts.service';
import { Post } from './../../interfaces/post';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  constructor(
    public postService: PostsService
  ) { }

  public title = '';
  public body = '';

  /**
   * ngOnInit - подписывает значение полей формы на изменение соответствующего свойства в сервисе.
   */
  ngOnInit() {
    this.postService.currentPostObservableSubject.subscribe((data: Post) => {
      this.title = data.title;
      this.body = data.body;
    }, (err) => console.log(err));
  }

  /**
   * onEdit:
   *    1. Проверяет значения полей формы, если поля пусты - выводит сообщение о том, что поля необходимо заполнить;
   *    2. Вызывает метод для отправки формы в сервисе;
   *    3. Обнуляет форму.
   * @param form - форма отправки нового поста
   */
  onEdit(form: NgForm): void {
    if (!this.title || !this.body) {
      return console.log('Enter title and text');
    }
    this.postService.onSubmitEditing(this.title, this.body);
    form.reset();
  }

  /**
   * onCansel - обнуляет форму и возвращает ее в состояние для отправки
   */
  onCansel(form: NgForm) {
    form.reset();
    this.postService.postFormName = 'submit';
    this.postService.buttonName = 'Create';
  }
}
