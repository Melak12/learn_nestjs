import { Inject, Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Console } from 'console';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { Connection, Repository } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {


    constructor(@InjectRepository(Coffee) private readonly coffeeRepo: Repository<Coffee>, 
    @InjectRepository(Flavor) private readonly flavorRepo: Repository<Flavor>,
    private readonly connection: Connection, 
    @Inject(COFFEE_BRANDS) coffeeBrands: string[]
    ) {
        // console.log(coffeeBrands);
        
     }

    async findAll(paginationQuery: PaginationQueryDto): Promise<Coffee[]> {

        const {limit, offset} = paginationQuery;

        return await this.coffeeRepo.find({
            relations: ['flavors'], // eager loading
            skip: offset,
            take: limit
        });
    }

    async findOne(id: number): Promise<Coffee> {
        const coffee = await this.coffeeRepo.findOne(id, {
            relations: ['flavors']
        });
        if (!coffee) {
            throw new NotFoundException();
        }

        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        //map all flavors
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
        );

        const coffee = this.coffeeRepo.create({
            ...createCoffeeDto,
            flavors
        });
        return this.coffeeRepo.save(coffee);
    }

    async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
        
        //map all flavors and add a inline condition for an optional flavors in the updateCoffee Dto to make sure we actually "have" flavors 
        //before calling the map functions to be preloaded. Unless, we would get "undefined" error
        const flavors = updateCoffeeDto.flavors && (await Promise.all(
            updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
        ));

        //preload first looks to see if an entity already exists in the database, and if so, 
        //retrieves it and everything related to it. If an entity exists already, preload replaces all of the 
        //values with the new ones passes. It returns Undefined, if the passed id is not existed in the db.
        const coffee = await this.coffeeRepo.preload({
            id: +id,
            ...updateCoffeeDto, 
            flavors
        });

        if (!coffee) {
            throw new NotFoundException();
        }
    }

    async remove(id: number) {
        const coffee = await this.findOne(id);
        return this.coffeeRepo.remove(coffee);
    }

    //transactions allows us to perform multiple actions to our database, ensuring they only happen if everything is fine. 
    async recommendCoffee(coffee: Coffee) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            coffee.recommendations++;

            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = {coffeeId:  coffee.name}

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendEvent);

            await queryRunner.commitTransaction();


            
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const existingFlavor = await this.flavorRepo.findOne({name});
        if(existingFlavor) {
            return existingFlavor;
        }

        return this.flavorRepo.create({name});
    }
}
