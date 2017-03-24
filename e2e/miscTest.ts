#!/usr/bin/env node

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeWhile';

const log = console.log;

log('Create Interval 0..5');
const reconnectionObservable = Observable.interval(2000)
  .takeWhile((v, index) => {
    log('takeWhile ', index);
    return index < 5;
    });


log('subscribe');
Subscription = reconnectionObservable.subscribe(
  () => log('tick'),
  (error) => log(error),
  () => log('byebye')
  );
