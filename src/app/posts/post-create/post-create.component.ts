import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = '';
  isLoading = false;
  private mode = 'create';
  private postId: string;
  post: Post;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
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
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    console.log(form);
    if (form.invalid) {
      console.log('Form is invalid');
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      console.log('Creating post in onSavePost');
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      console.log('updating post in onSavePost');
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }

    console.log('about to reset the form after a ' + this.mode);
    form.resetForm();
  }

}
