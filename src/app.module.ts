import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesController } from './coffees/coffees.controller';
import { CoffeesService } from './coffees/coffees.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import * as Joi from '@hapi/joi';

@Module({
  // imports: [CoffeesModule, TypeOrmModule.forRoot({
  //   type: 'postgres', 
  //   host: 'localhost',
  //   port: 5432,
  //   username: 'postgres',
  //   password: 'pass123',
  //   database: 'postgres',
  //   autoLoadEntities: true,
  //   synchronize: true //make sure to our entities are synched with db everytime the 
  //   //app runs. MAKE SURE TO DISABLE THIS ON THE PRODUCTION
  // })],

  imports: [
    ConfigModule.forRoot(
      {
        // ignoreEnvFile: true,// use this in the production because we can use the host's env't virables. 
        validationSchema: Joi.object({
          DATABASE_HOST: Joi.required(),
          DATABASE_PORT: Joi.number().default(5432)
        })
      }
    ),
    CoffeesModule, 
    TypeOrmModule.forRoot(), 
    CoffeeRatingModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
