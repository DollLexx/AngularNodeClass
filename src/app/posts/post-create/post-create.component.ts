import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = '';
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private postId: string;
  post: Post;
  imagePreview: string;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [
        Validators.required,
        Validators.minLength(3)
      ]}),
      'content': new FormControl(null, {validators: [
        Validators.required
      ]}),
      'image': new FormControl(null, {
        validators: [ Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // start spinner
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((post) => {
          // end spinner
          this.isLoading = false;
          this.post = {id: post.id, title: post.title, content: post.content};
          this.form.setValue(
            {
            'title': this.post.title,
            'content': this.post.content
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({
        image: file
      });
      this.form.get('image').updateValueAndValidity();
      console.log(file);
      console.log(this.form);
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = <string>reader.result;
      };
      reader.readAsDataURL(file);
  }

  onSavePost(){
    console.log(this.form);
    if (this.form.invalid) {
      console.log('Form is invalid');
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      console.log('Creating post in onSavePost');
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image);
    } else {
      console.log('updating post in onSavePost');
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }

    console.log('about to reset the form after a ' + this.mode);
    this.form.reset();
  }

}
