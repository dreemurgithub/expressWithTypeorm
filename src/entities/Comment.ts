import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Post } from './Post';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  content!: string;

  @Column()
  authorName!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // Many-to-One: Many Comments belong to one Post
  @ManyToOne(() => Post, post => post.comments, { onDelete: 'CASCADE' })
  post!: Post;
}
