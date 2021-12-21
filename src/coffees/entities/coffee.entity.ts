import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";

// @Index(['name', 'brand']) //multiple indexing
@Entity()
export class Coffee {
    @PrimaryGeneratedColumn()
    id: number;

    @Index() //single indexing
    @Column()
    name: string;

    @Column({nullable: true})
    description: string;

    @Column({nullable: true})
    remark: string;

    @Column()
    brand: string;

    @Column({default: 0})
    recommendations: number;

    // @Column('json', {nullable: true})
    @JoinTable() //specified the owner side of the relation (which is this Coffee Entity)
    @ManyToMany(type=> Flavor, (flavor) => flavor.coffees, {
        cascade: true //any new flavors would be created in the Flavors tables along side with the coffee
    })
    flavors: Flavor[];
}