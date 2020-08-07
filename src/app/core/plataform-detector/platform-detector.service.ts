import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root'})
export class PlatformDetectorService { 

    constructor(@Inject(PLATFORM_ID) private platformId: string) { }

    isPlatformBrowser() {
        console.log( 'platformId: ', this.platformId );
        return isPlatformBrowser(this.platformId);
    }

    isPlatformMobile() {
        console.log( 'platformmobile: ', this.isPlatformMobile );
        return this.isPlatformMobile();
    }
}