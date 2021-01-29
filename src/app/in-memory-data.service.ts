import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService{

  constructor() { }

  createDb(){
    const heroes = [
    {id:1, name:"Batman"},
    {id:2, name:"Spiderman"},
    {id:3, name:"Scorpion"},
    {id:4, name:"Green Goblin"},
    {id:5, name:"Superman"},
    {id:6, name:"Black"},
    {id:7, name:"Magneto"},
    {id:8, name:"Storm"},
    {id:9, name:"Deadpool"},
    {id:10, name:"Killer Bean"},
    {id:11, name:"Keanu"},
    {id:12, name:"Optimus"},
    ];
    return {heroes};
  }

  genId(heroes: Hero[]): number{
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1: 1;
  }
}
