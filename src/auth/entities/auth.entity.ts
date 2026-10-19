import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true })
    email: string;

    @Column({ type: 'text', select: false })
    password: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @Column({ type:'text', array: true, default:['user']})
    roles: string[];

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdet() {
        this.checkFieldsBeforeInsert()
    }
}
