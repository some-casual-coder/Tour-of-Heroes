import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  // A Subject is both a source of observable values and an Observable itself
  private searchTerm = new Subject<string>()

  constructor(private heroService: HeroService) { }

  //To push search values into the Observable using its next method
  search(name: string){
    this.searchTerm.next(name);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerm.pipe(
      //Wait 300 ms before sending the latest request
      debounceTime(300),

      //To avoid sending a request if the search term is unchanged
      distinctUntilChanged(),

      //If a search term makes it through the above a request is sent and the latest observable is presented
      switchMap((name: string) => this.heroService.search(name))
    );
  }

}
