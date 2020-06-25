import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { consolelog } from 'src/app/shared/utils/mylibs';

@Injectable({ providedIn: 'root'})
export class PlatformDetectorService { 

    constructor(@Inject(PLATFORM_ID) private platformId: string) { }

    isPlatformBrowser() {
        consolelog( 'platformId: ', this.platformId );
        return isPlatformBrowser(this.platformId);
    }

    isPlatformMobile() {
        consolelog( 'platformmobile: ', this.isPlatformMobile );
        return this.isPlatformMobile();
    }
}