import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class VerifiedInstitution {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  publicKey: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  phone: string

  @Column()
  address: string

  @Column()
  website: string

  @Column()
  representative: string

  @Column()
  representativeEmail: string

  @Column()
  createdAt: Date

  @Column()
  updatedAt: Date

  @Column()
  verified: boolean
}
