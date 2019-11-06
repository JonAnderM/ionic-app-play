import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';
//import { MbscScrollViewOptions } from '@mobiscroll/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { StatusBar } from '@ionic-native/status-bar/ngx';



// let status bar overlay webview


@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
})
export class SchedulePage implements OnInit {
  // Gets a reference to the list element
  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;

  ios: boolean;
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  items = [];
  mediaVideo = [];
  newUpdated = [];
  groups: any = [];
  confDate: string;

  constructor(
    private statusBar: StatusBar,
    public alertCtrl: AlertController,
    public confData: ConferenceData,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public toastCtrl: ToastController,
    public user: UserData,
    public config: Config
  ) { 
    this.statusBar.overlaysWebView(true);
  //  scrollViewOptions: MbscScrollViewOptions = {
  //    layout: 'fixed',
  //    itemWidth: 134,
  //    snap: false
   // }
   }

  ngOnInit() {
    this.llenarDatos();
    this.updateSchedule();

    this.ios = this.config.get('mode') === 'ios';
  }

  updateSchedule() {
    // Close any open sliding items when the schedule updates
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }

    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;
      this.groups = data.groups;
    });
  }

  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: ScheduleFilterPage,
      componentProps: { excludedTracks: this.excludeTracks }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
      this.updateSchedule();
    }
  }

  async addFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any) {
    if (this.user.hasFavorite(sessionData.name)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
    } else {
      // remember this session as a user favorite
      this.user.addFavorite(sessionData.name);

      // create an alert instance
      const alert = await this.alertCtrl.create({
        header: 'Favorite Added',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      await alert.present();
    }

  }

  async removeFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any, title: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
            this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    await alert.present();
  }

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingCtrl.create({
      message: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      for (let i = 0; i < 30; i++) {
        this.items.push( this.items.length );
      }

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
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

/*


import { Component } from '@angular/core';
import { MbscScrollViewOptions } from '@mobiscroll/angular';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    scrollViewOptions: MbscScrollViewOptions = {
        layout: 'fixed',
        itemWidth: 134,
        snap: false
    };

    newGames = [{
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

    mediaVideo = [{
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

    newUpdated = [{
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


*/