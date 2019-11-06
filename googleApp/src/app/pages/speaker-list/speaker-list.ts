import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage {
  speakers: any[] = [];
  newUpdated = [];
  items = [];
  mediaVideo = [];

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public confData: ConferenceData,
    public inAppBrowser: InAppBrowser,
    public router: Router
  ) {
      this.llenarDatos();
  }

  ionViewDidEnter() {
    this.confData.getSpeakers().subscribe((speakers: any[]) => {
      this.speakers = speakers;
    });
  }

  goToSpeakerTwitter(speaker: any) {
    this.inAppBrowser.create(
      `https://twitter.com/${speaker.twitter}`,
      '_blank'
    );
  }

  async openSpeakerShare(speaker: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            console.log(
              'Copy link clicked on https://twitter.com/' + speaker.twitter
            );
            if (
              (window as any)['cordova'] &&
              (window as any)['cordova'].plugins.clipboard
            ) {
              (window as any)['cordova'].plugins.clipboard.copy(
                'https://twitter.com/' + speaker.twitter
              );
            }
          }
        },
        {
          text: 'Share via ...'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async openContact(speaker: any) {
    const mode = 'ios'; // this.config.get('mode');

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Contact ' + speaker.name,
      buttons: [
        {
          text: `Email ( ${speaker.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.open('mailto:' + speaker.email);
          }
        },
        {
          text: `Call ( ${speaker.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.open('tel:' + speaker.phone);
          }
        }
      ]
    });

    await actionSheet.present();
  }

  llenarDatos(){
    this.items = [{
        image: 'https://img.mobiscroll.com/demos/worms3.png',
        title: 'Worms 3',
        dev: 'Team 17 Digital Limited',
        rank: 4.2
    }, {
        image: 'https://img.mobiscroll.com/demos/candycrush.png',
        title: 'Candy Crush Saga',
        dev: 'King',
        rank: 4.3
    }, {
        image: 'https://img.mobiscroll.com/demos/angrybirds.png',
        title: 'Angry Birds',
        dev: 'Rovino',
        rank: 4.4
    }, {
        image: 'https://img.mobiscroll.com/demos/nfs.png',
        title: 'Need for Speed™ No Limits',
        dev: 'ELECTRONIC ARTS',
        rank: 4.3
    }, {
        image: 'https://img.mobiscroll.com/demos/heartstone.png',
        title: 'Hearthstone',
        dev: 'Blizzard Entertainment Inc.',
        rank: 4.2
    }, {
        image: 'https://img.mobiscroll.com/demos/fruitninja.png',
        title: 'Fruit Ninja',
        dev: 'Halfbrick Studios',
        rank: 4.3
    }, {
        image: 'https://img.mobiscroll.com/demos/subwaysurf.png',
        title: 'Subway Surfers',
        dev: 'Kiloo',
        rank: 4.4
    }, {
        image: 'https://img.mobiscroll.com/demos/templerun.png',
        title: 'Temple Run',
        dev: 'Imangi Studios',
        rank: 4.3
    }, {
        image: 'https://img.mobiscroll.com/demos/minecraft.png',
        title: 'Minecraft: Pocket Edition',
        dev: 'Mojang ',
        rank: 4.4
    }];
    this.mediaVideo = [{
      image: 'https://img.mobiscroll.com/demos/vlc.png',
      title: 'VLC for Android',
      dev: 'Videolabs ',
      rank: 4.3
  }, {
      image: 'https://img.mobiscroll.com/demos/realplayer.png',
      title: 'RealPlayer®',
      dev: 'RealNetworks, Inc.',
      rank: 4.3
  }, {
      image: 'https://img.mobiscroll.com/demos/motogal.png',
      title: 'Motorola Gallery',
      dev: 'Motorola Mobility LLC. ',
      rank: 3.9
  }, {
      image: 'https://img.mobiscroll.com/demos/revesemov.png',
      title: 'Reverse Movie FX',
      dev: 'Bizo Mobile',
      rank: 4.6
  }, {
      image: 'https://img.mobiscroll.com/demos/sure.png',
      title: 'SURE Universal Remote',
      dev: 'Tekoia Ltd.',
      rank: 4.4
  }, {
      image: 'https://img.mobiscroll.com/demos/ringdriod.png',
      title: 'Ringdroid',
      dev: 'Ringdroid Team ',
      rank: 4.4
  }, {
      image: 'https://img.mobiscroll.com/demos/funny.png',
      title: 'Funny Camera - Video Booth Fun',
      dev: 'Kiloo',
      rank: 4.1
  }, {
      image: 'https://img.mobiscroll.com/demos/gif.png',
      title: 'GIF Keyboard',
      dev: 'IRiffsy, Inc.',
      rank: 4.1
  }, {
      image: 'https://img.mobiscroll.com/demos/bs.png',
      title: 'BSPlayer',
      dev: 'BSPlayer media',
      rank: 4.4
  }, {
      image: 'https://img.mobiscroll.com/demos/vac.png',
      title: 'video audio cutter',
      dev: 'mytechnosound ',
      rank: 4.3
  }];
  
  this.newUpdated = [{
      image: 'https://img.mobiscroll.com/demos/netflix.png',
      title: 'Netflix',
      dev: 'Netflix, Inc. ',
      rank: 4.4
  }, {
      image: 'https://img.mobiscroll.com/demos/colorfy.png',
      title: 'Colorfy - Coloring Book Free',
      dev: 'Fun Games For Free',
      rank: 4.7
  }, {
      image: 'https://img.mobiscroll.com/demos/wego.png',
      title: 'Wego Flights & Hotels',
      dev: 'Wego.com',
      rank: 4.3
  }, {
      image: 'https://img.mobiscroll.com/demos/ali.png',
      title: 'Alibaba.com B2B Trade App',
      dev: 'Alibaba.com Hong Kong Limited ',
      rank: 4.1
  }, {
      image: 'https://img.mobiscroll.com/demos/5k.png',
      title: '5K Run: 5K Runner®',
      dev: 'Fitness22',
      rank: 4.4
  }, {
      image: 'https://img.mobiscroll.com/demos/nuzzelnws.png',
      title: 'Nuzzel News',
      dev: 'Nuzzel, Inc.',
      rank: 4.3
  }, {
      image: 'https://img.mobiscroll.com/demos/solarsysexpl.png',
      title: 'Solar System Explorer 3D',
      dev: 'Neil Burlock',
      rank: 4.5
  }, {
      image: 'https://img.mobiscroll.com/demos/elevate.png',
      title: 'Elevate - Brain Training',
      dev: 'Elevate Labs',
      rank: 4.5
  }, {
      image: 'https://img.mobiscroll.com/demos/deezer.png',
      title: 'Deezer Music',
      dev: 'Deezer Mobile',
      rank: 4.1
  }];
    }
}
