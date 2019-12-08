import { Component, OnInit, OnDestroy } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit,OnDestroy {

  private userSub:Subscription;
isAtuthenticated = false;
  ngOnDestroy(): void {
this.userSub.unsubscribe();  }

  ngOnInit(): void {
this.userSub = this.authService.user.subscribe(user=>{
this.isAtuthenticated = !user?false:true;
//= !!user

});

}
  constructor(private dataStorageService: DataStorageService,private authService:AuthService,private route:Router) {}

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogOut(){
    this.authService.logout();
    this.route.navigate(["/auth"]);
  }
}
