import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  content!: string;

  @Column({ default: true })
  isPublished!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Many-to-One: Many Posts belong to one User
  @ManyToOne(() => User, user => user.posts, { onDelete: 'CASCADE' })
  user!: User;

  // One-to-Many: Post has many Comments
  @OneToMany(() => Comment, comment => comment.post)
  comments!: Comment[];
}
