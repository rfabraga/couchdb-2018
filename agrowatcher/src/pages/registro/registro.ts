import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { RegistrosProvider } from '../../providers/registros/registros';
/**
 * Generated class for the RegistroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  private registro_nav: any = this.navParams.get('registro');
  private registro: any = {
    _id: null,
    _rev: null,
    codigo: null,
    peso: null,
    tipo_animal: null,
    descricao: null
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private registrosProvider: RegistrosProvider) {
    this.initRegistro();
  }

  initRegistro(): void {
    if (this.registro_nav) {
      this.registro._id = this.registro_nav._id;
      this.registro._rev = this.registro_nav._rev;
      this.registro.codigo = this.registro_nav.codigo;
      this.registro.peso = this.registro_nav.peso;
      this.registro.tipo_animal = this.registro_nav.tipo_animal;
      this.registro.observacoes = this.registro_nav.observacoes;
    }
  }

  createRegistro(): void {
    let loader = this.loadingCtrl.create({
      content: 'Aguarde...'
    });
    loader.present();

    this.registrosProvider.createRegistro(this.registro).then((data) => {
        loader.dismiss();
        this.toastCtrl.create({
          message: 'Registro criado com sucesso.',
          duration: 3000
        }).present();
    });
  }

  updateRegistro(): void {
    let loader = this.loadingCtrl.create({
      content: 'Aguarde...'
    });
    loader.present();

    this.registrosProvider.updateRegistro(this.registro).then((data) => {
        loader.dismiss();
        this.toastCtrl.create({
          message: 'Registro atualizado com sucesso.',
          duration: 3000
        }).present();
    });
  }

}
