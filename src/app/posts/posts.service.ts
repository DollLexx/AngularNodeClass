import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];

  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http.get<{message: string, posts: any }>('http://localhost:3000/api/posts')
    .pipe( map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        };
      });
    }))
    .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
    });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId )
    .subscribe(() => {
      console.log('Deleted post');
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    // return {...this.posts.find(p => p.id === id)};  can't return like this anymore.  Need to return async
    console.log('Am in the get post method passing in an id of ' + id);
    const returnValue = this.http.get<{
      id: string,
      title: string,
      content: string,
      imagePath: string }>(
        'http://localhost:3000/api/posts/' + id);

      console.log('Found the following object ', returnValue);

    return returnValue;
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    console.log('In update post in post service');
    console.log('id is  ' + id);
    let postData: Post | FormData = null;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {id: id,
        title: title,
        content: content,
        imagePath: image };

    }
    this.http
    .put<{message: string, post: Post}>('http://localhost:3000/api/posts/' + id, postData)
    .subscribe((responseData) => {
      console.log('Updated Post message is ' + responseData.message);
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id);

      updatedPosts[oldPostIndex] = responseData.post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate([
        '/'
      ]);
    });
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
    .post<{message: string, post: Post }>(
      'http://localhost:3000/api/posts', postData
      )
      .subscribe((responseData) => {
        console.log('Post message is ' + responseData.message);
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate([
          '/'
        ]);
      });

  }
}
