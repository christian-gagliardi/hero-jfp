import { Observable } from 'rxjs';
import { HeroByIdInterface } from './hero-by-id.interface';
import { HeroInterface } from './hero.interface';


export interface HeroServiceInterface {
    findOne(data: HeroByIdInterface): Observable<HeroInterface>;
    findMany(upstream: Observable<HeroByIdInterface>): Observable<HeroInterface>;
}