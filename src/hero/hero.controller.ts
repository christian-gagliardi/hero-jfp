import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientGrpc, GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { toArray, tap, map } from 'rxjs/operators';
import { HeroByIdInterface } from './interfaces/hero-by-id.interface';
import { HeroInterface } from './interfaces/hero.interface';
import { HeroServiceInterface } from './interfaces/hero-service.interface';

import { HeroService } from './hero.service';



@Controller('hero')
export class HeroController {


  constructor(private readonly heroService: HeroService) {}

  @Get()
  getMany(): Observable<HeroInterface[]> {
    const ids$ = new ReplaySubject<HeroByIdInterface>();
    ids$.next({ id: 1 });
    ids$.next({ id: 2 });
    ids$.complete();
    
    const stream = this.heroService.findMany(ids$.asObservable());

    return stream.pipe(toArray());
  }

  @Get(':id')
  getById(@Param('id') id: string): Observable<HeroInterface> {
    return this.heroService.findOne({ id: +id });
  }


  @Get('acc/:id')
  async getAccessories(@Param('id') id: string){    
    const hero = this.heroService.findOne({ id: +id });
    const result = this.heroService.getAccessories(id);
    return result.pipe(
      map(data => {
        hero.accessories = data
        return hero
      })
    )
  }

}
