import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Controller('coffees')
export class CoffeesController {

    constructor(private readonly coffeeService: CoffeesService){}

    @Get()
    findAll(@Query() paginationQuery): Coffee[]{
        const {limit, offset} = paginationQuery
        // return `This action returns all coffees. Limit ${limit}, offset: ${offset}`;

        return this.coffeeService.findAll();
    }
    
    @Get(':id')
    findOne(@Param('id') id: string) {
        const coffee =  this.coffeeService.finidOne(Number(id));
        if(!coffee) {
            throw new NotFoundException();
            //or we can do this way
            // throw new HttpException('Coffe is not found', HttpStatus.NOT_FOUND);
        }

        return coffee;
    }


    @Post()
    create(@Body() createCoffeeDto: CreateCoffeeDto) {
     this.coffeeService.create(createCoffeeDto);
     return createCoffeeDto;
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto ) {
        this.coffeeService.update(id, updateCoffeeDto);
        return updateCoffeeDto;
    }

    @Delete(':id')
    remove(@Param('id') id) {
        return this.coffeeService.remove(Number(id));
    }
}
