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
  private title = '';
  private body = '';

  constructor(
    private postService: PostsService
  ) { }

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
   * onSubmit:
   *    1. Проверяет значения полей формы, если поля пусты - выводит сообщение о том, что поля необходимо заполнить;
   *    2. Вызывает метод для отправки формы в сервисе;
   *    3. Обнуляет форму.
   * @param form - форма
   */
  private onSubmit(form: NgForm): void {
    if (!this.title || !this.body) {
      return console.log('Enter title and text');
    }
    this.postService.submitPost(this.title, this.body);
    form.reset();
  }

  /**
   * onCansel - сбрасывает форму и вызывает метод для обновлния параметров формы в разметке
   */
  private onCansel(form: NgForm) {
    form.reset();
    this.postService.changeFormOptions();
  }
}
