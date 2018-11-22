import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import PouchDb from 'pouchdb';

/*
  Generated class for the RegistrosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RegistrosProvider {

  private data: any;
  private db: any;
  private remote: any;
  private options: any = {
    live: false,
    retry: false,
    continuous: false
  }

  constructor(public http: HttpClient) {
    this.db = new PouchDb('agrowatcher');

    this.remote = 'http://localhost:5984/agrowatcher/';
  }

  getRegistros(): any {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {
      this.db.allDocs({ include_docs: true }).then((result) => {
        this.data = [];

        let docs = result.rows.map((row) => {
          this.data.push(row.doc);
        });

        resolve(this.data);

        this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          this.handleChange(change);
        });
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  syncDB(): any {
    this.db.sync(this.remote, this.options);
  }

  createRegistro(registro: any): any {
    return new Promise(resolve => {
      this.db.post(registro).then(function (response) {
        resolve(response);
      });
    });
  }

  updateRegistro(registro: any): any {
    return new Promise(resolve => {
      this.db.put(registro).then(function (response) {
        resolve(response);
      });
    });
  }

  deleteRegistro(registro: any): any {
    return new Promise(resolve => {
      this.db.remove(registro).then(function (response) {
        resolve(response);
      });
    });
  }

  handleChange(change): void{
    let changedDoc = null;
    let changedIndex = null;

    this.data.forEach((doc, index) => {
      if(doc._id === change.id){
        changedDoc = doc;
        changedIndex = index;
      }
    });

    //A document was deleted
    if(change.deleted){
      this.data.splice(changedIndex, 1);
    } else {
      if(changedDoc){ //A document was updated
        this.data[changedIndex] = change.doc;
      } else { //A document was added
        this.data.push(change.doc);
      }
    }
  }

}
