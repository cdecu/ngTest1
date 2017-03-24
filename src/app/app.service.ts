import { Injectable } from '@angular/core';

@Injectable()
export class AppService {

  public Rpts = [
    {name: '010', descr: 'ModePays'},
    {name: '011', descr: 'Jours'},
    {name: '012', descr: 'Days'},
    {name: '013', descr: '013'},
    {name: '014', descr: '014'},
    {name: '041', descr: '041'},
    {name: 'Cloture', descr: 'Cloture'},
    ];

  public Formats = [
    {name: 'TEXT', descr: 'Text'},
    {name: 'XML', descr: 'Xml'},
    {name: 'JSON', descr: 'Json'},
    ];

  constructor() { }

}
