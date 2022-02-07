import { OnModuleInit, Injectable, Inject } from '@nestjs/common';
import { AccessoriesServiceInterface } from './interfaces/accessories-service.interface';
import { ClientGrpc, GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable, ReplaySubject, Subject } from 'rxjs';

import { HeroByIdInterface } from './interfaces/hero-by-id.interface';
import { HeroInterface } from './interfaces/hero.interface';
import { HeroServiceInterface } from './interfaces/hero-service.interface';

@Injectable()
export class HeroService implements OnModuleInit {
  private readonly items: HeroInterface[] = [{ id: 1, name: 'John' }, { id: 2, name: 'Doe' }];
  private accessoriesService: AccessoriesServiceInterface;
  private heroService: HeroServiceInterface;

  constructor(
    @Inject('ACCESSORIES_PACKAGE') private accessoriesClient: ClientGrpc,
    @Inject('HERO_PACKAGE') private readonly client: ClientGrpc
  ) {}

  onModuleInit() {
    this.heroService = this.client.getService<HeroServiceInterface>('HeroService');
    this.accessoriesService = this.accessoriesClient.getService<AccessoriesServiceInterface>('AccessoriesService');
  }

  getAccessories(id): Observable<any> {
    return this.accessoriesService.findById({id:id});
  }

  @GrpcMethod('HeroService')
  //findOne(data: HeroByIdInterface): HeroInterface
  findOne(data: HeroByIdInterface): any { 
    return this.items.find(({ id }) => id === data.id);
  }

  @GrpcStreamMethod('HeroService')
  findMany(data$: Observable<HeroByIdInterface>): Observable<HeroInterface> {
    const hero$ = new Subject<HeroInterface>();

    const onNext = (heroById: HeroByIdInterface) => {
      const item = this.items.find(({ id }) => id === heroById.id);
      hero$.next(item);
    };
    const onComplete = () => hero$.complete();
    data$.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return hero$.asObservable();
  }



}

