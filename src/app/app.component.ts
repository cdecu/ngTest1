import { Component, Optional } from '@angular/core';
import {MdDialog,MdDialogRef,MdSnackBar} from '@angular/material';
import {Http, Headers, RequestOptions, URLSearchParams, Response} from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
// import 'formattor';

export class Rpt{
  loaded: boolean;
  name: string;
  params: string;
  content: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  lastDialogResult: string;
  title : string = 'Jean!';
  progress: number = 0;
  currentRpt = {loaded:0, name: 'Test', params: 'NoParams', error:'Not Loaded', content: 'NoContent'};

  public IID: string = 'cdecu';
  public PrivateKey: string = '1611041114';
  public D1: string = '2009/01/01';

  public Rpts: any[] = [
    {name: '010', descr: 'ModePays'},
    {name: '011', descr: 'Jours'},
    {name: '012', descr: 'Days'},
    {name: 'Cloture', descr: 'Cloture'},
  ];
  public Rpt = this.Rpts[0];

  public Formats: any[] = [
    {name: 'TEXT', descr:'Text'},
    {name: 'XML', descr:'Xml'},
    {name: 'JSON', descr:'Json'},
  ];
  public Format = this.Formats[0];

  constructor(private http: Http,
              private requestOptions: RequestOptions,
              private dialog: MdDialog,
              private snackbar: MdSnackBar

             ) {
    // Update the value for the progress-bar on an interval.
    setInterval(() => {
      this.progress = (this.progress + Math.floor(Math.random() * 4) + 1) % 100;
    }, 300);
  }

  openDialog() {
    let dialogRef = this.dialog.open(DialogContent);

    dialogRef.afterClosed().subscribe(result => {
      this.lastDialogResult = result;
      })
    }

  showSnackbar() {
      this.snackbar.open('YUM SNACKS', 'CHEW');
    }

  getRpt (): Observable<string> {
    // let rptUrl: string = 'http://vpn.restomax.com:8080';
    let rptUrl: string = 'http://10.0.0.69:8080/view';

    let params = new URLSearchParams();
    params.set('view', this.Rpt.name);
    params.set('staff', '221266');
    params.set('IID', this.IID);
    params.set('PK',  this.PrivateKey);
    params.set('GUID', '123');
    params.set('fmt', this.Format.name );
    params.set('D1', '20090101');

    return this.http.get(rptUrl, {search: params} )
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.text();
    console.log(body);
    return body || { };
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    //console.error(error);
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `Error ${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
      }
    //console.error(errMsg);
    return Observable.throw(errMsg);
    }

  fetchRpt(){
    this.currentRpt.loaded=1;
    this.getRpt()
     .subscribe(
       Rpt => {this.currentRpt.content = Rpt; this.currentRpt.loaded=2},
       error =>  {this.currentRpt.error = <any>error; this.currentRpt.loaded=0}
       );
    }
}


@Component({
  template: `
    <p>This is a dialog</p>
    <p>
      <label>
        This is a <b>TEXT</b> box inside of a dialog.
        <input #dialogInput>
      </label>
    </p>
    <p> <button md-button (click)="dialogRef.close(dialogInput.value)">CLOSE</button> </p>
  `,
})export class DialogContent {
  constructor(@Optional() public dialogRef: MdDialogRef<DialogContent>) { }
}

