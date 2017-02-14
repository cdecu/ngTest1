import { Component, Optional } from '@angular/core';
import {MdDialog,MdDialogRef,MdSnackBar} from '@angular/material';
import {Http, Headers, RequestOptions, URLSearchParams, Response} from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'formattor';

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
  currentRpt = {loaded:false, name: 'Test', params: 'NoParams', content: 'NoContent'};
  
  foods: any[] = [
    {name: 'Pizza', rating: 'Excellent'},
    {name: 'Burritos', rating: 'Great'},
    {name: 'French fries', rating: 'Pretty good'},
  ];

  constructor(private http: Http,private requestOptions: RequestOptions,private dialog: MdDialog, private snackbar: MdSnackBar) {
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
  
  getRpt (): Observable<Rpt> {
    let rptUrl: string = 'http://vpn.restomax.com:8080';
    
    //let headers = new Headers({ 'Content-Type': 'application/xml' });
    //headers.append('Authorization', `Bearer ${authToken}`);
    //headers.append('Access-Control-Allow-Origin','*');
    
    let params = new URLSearchParams();
    params.set('action', 'View');
    params.set('view', '010');
    params.set('staff', '221266');
    params.set('IID', 'cdecu1');
    params.set('PK', '1601071534');
    params.set('GUID', '123');
    params.set('format', 'json');
  
    //let options = new RequestOptions({headers: headers, search: params});
    //this.requestOptions.headers.set('Access-Control-Allow-Origin','*');
    //this.requestOptions.search=params;
    
    return this.http.get(rptUrl, {search: params} )
      .map(this.extractData)
      .catch(this.handleError);
  }
  
  private extractData(res: Response) {
    let body = res.json();
    console.log(body);
    return body.data || { };
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
    this.currentRpt.loaded=false;
    this.currentRpt.loaded=true;
    this.currentRpt.content=formattor(
`<response type="error">
      <ErrorCode>2002</ErrorCode>
      <ErrMsg>BOUNCING ERROR</ErrMsg>
    <Duration>00:00:00 344</Duration>
    </response>`,
      {method: 'xml'}
      );
    
    //this.getRpt()
    //  .subscribe(
    //    Rpt => this.currentRpt = Rpt,
    //    error =>  {this.currentRpt.content = <any>error; this.currentRpt.loaded=true}
    //    );
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

