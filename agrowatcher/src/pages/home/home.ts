import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';

//providers
import { RegistrosProvider } from '../../providers/registros/registros';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private registros: any = [];
  private registros_copy: any = [];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private registrosProvider: RegistrosProvider) {
    this.getRegistros();
  }

  syncAttempt(): void {
    this.registrosProvider.syncDB();
  }

  /**
   * Chama a função para pegar registros na base indexada
   * @return void
   */
  getRegistros(): void {
    let loader = this.loadingCtrl.create({
      content: 'Aguarde...'
    });
    loader.present();

    this.registrosProvider.getRegistros().then((data) => {
      this.registros = data;
      this.registros_copy = data;
      loader.dismiss();
    });
  }


  /**
   * Função para filtrar registros baseados no código
   * @param {any} ev [description]
   */
  buscarRegistro(ev: any): void {
    this.registros = this.registros_copy;

    const val = ev.target.value;

    if (val && val.trim() != '') {
      this.registros = this.registros.filter((item) => {
        return (item.codigo.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  /**
   * Abre a página de registro
   * @param {any} registro Registro a ser editado 
   */
  abrirRegistro(registro: any): void {
    this.navCtrl.push('RegistroPage', { 'registro': registro });
  }

  /**
   * Exibe alerta de confirmação de exclusão de registro
   * Caso confirmado, exclui registro do banco indexado
   * @param {any} registro [description]
   */
  deleteRegistro(registro: any): void {
    let alert = this.alertCtrl.create({
      title: 'Confirmar Exclusão',
      subTitle: 'Deseja excluir este registro?',
      buttons: [
        {
          text: 'Excluir',
          handler: ()  => {
            let loader = this.loadingCtrl.create({
              content: 'Aguarde...'
            });
            loader.present();

            this.registrosProvider.deleteRegistro(registro).then((data) => {
              loader.dismiss();
              this.toastCtrl.create({
                message: 'Registro excluído com sucesso.',
                duration: 3000
              }).present();
            });
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    }).present();
  }

}
