import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Hero } from './hero';
import { MessageService } from './message.service';
import { HEROES } from './my-heroes';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(
    private messageService: MessageService,
    private http: HttpClient
    ) { }

  private heroesUrl = "api/heroes";
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  private log(message: string){
    this.messageService.add(`${message}`);
  }

  /** 
  @param operation - gives the specific operation that failed to execute
  @param result - the optional value to return as the observable result 
  */
  private handleError<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      //Show an error message to the user
      this.log(`${operation} failed: ${error.message}`);
      //Return an empty result to keep the app running
      return of(result as T);
    };
  }

  getHeroes(): Observable<Hero[]>{
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      //catchError intercepts an observable that failed while handleError reports the error and returns a harmless result
      //use this if tap is deprecated
      // tap({
      //   complete: () => this.log("fetched heroes")
      // }),
      //_ is used to represent a parameter that will not be used in the function, you could also use ()
      tap(_ => this.log("fecthed heroes")),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero>{
    //Note the `` are used not '' for this syntax to work: template literal
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(() => this.log(`fecthed hero with id: ${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any>{
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero: id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`Added hero: id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero>{
    const id = typeof hero === 'number' ? hero: hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(() => this.log(`Deleted hero: id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  search(name: string): Observable<Hero[]>{
    if(!name.trim()){
      return of([]);
    }
    //Note: the name is returned based on whether it is part of the heroes name not depending on the first letter
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${name}`).pipe(
      tap(x => x.length ? 
        this.log(`found ${x.length} matches for "${name}"`):
        this.log(`found no matches for ${name}`)),
        catchError(this.handleError<Hero[]>(`search for ${name}`, []))
    );
  }
}
