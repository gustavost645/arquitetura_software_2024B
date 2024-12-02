import { Component, AfterViewInit, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { LoadingService } from './components/loading/service/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit, OnDestroy, OnInit {

  title = 'eventos';
  loading = false;

  private loadingSubscription: Subscription = new Subscription;

  constructor(private loadingService: LoadingService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    /*this.loadingSubscription = this.loadingService.isLoading().subscribe(isLoading => {
      this.loading = isLoading;
      this.cdr.detectChanges();
    });*/
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
