import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import {Request} from 'express'
import { Public } from 'src/common/decorators/public.decorator';

@Controller('coffees')
export class CoffeesController {

    constructor(private readonly coffeeService: CoffeesService,
        @Inject(REQUEST) private readonly request: Request
    ) {
        console.log(`Ip Address: ${request.ip}`)
    }


    @Public() //our custom decorator allows to access this handler without API Key guard
    @Get()
    async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<Coffee[]> {
        // await new Promise(resolve => setTimeout(resolve, 5000)); //Artificial Delay to test timeout interceptors
        return this.coffeeService.findAll(paginationQuery);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        const coffee = this.coffeeService.findOne(Number(id));
        if (!coffee) {
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
    update(@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
        this.coffeeService.update(id, updateCoffeeDto);
        return updateCoffeeDto;
    }

    @Delete(':id')
    remove(@Param('id') id) {
        return this.coffeeService.remove(Number(id));
    }
}
