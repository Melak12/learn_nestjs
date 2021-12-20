import { Injectable } from '@nestjs/common';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
    private coffees: Coffee[] = [
        {
            id: 1,
            name: 'Shipwreck Roast',
            brand: 'Buddy Brew',
            flavors: ['chocolate', 'vanilla']
        }
    ]

    findAll(): Coffee[] {
        return this.coffees;
    }

    finidOne(id: number): Coffee {
        return this.coffees.find(item => item.id === id);
    }

    create(createCoffeeDto: any) {
        this.coffees.push(createCoffeeDto);
    }

    update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
        const existingCoffee = this.finidOne(id);
        if(existingCoffee) {
            //update coffee
        }
    }

    remove(id: number) {
        const coffeeIndex = this.coffees.findIndex(item => item.id === id);
        if(coffeeIndex >= 0) {
            this.coffees.splice(coffeeIndex, 1);
        }
    }
}
