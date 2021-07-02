import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  IStatusResponse,
  IExistResponse,
  ICountResponse,
} from '../types/response';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Post as PostEntity } from './entity/post.entity';
import { PostResponse } from './interface/post-response.interface';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyPostList(@Req() req: any): Promise<PostEntity[]> {
    const { id } = req.user;
    return await this.postService.getMyPostList(id);
  }

  @Get()
  async getPostList(
    @Query('start', ParseIntPipe) start: number,
    @Query('keyword') keyword?: string,
  ): Promise<PostEntity[]> {
    return await this.postService.getPostList({ start, keyword });
  }

  @Get(':id')
  async getPostById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostResponse> {
    return await this.postService.getPostById(id);
  }

  @Get('count')
  async getCountOfPost(
    @Query('keyword') keyword?: string,
  ): Promise<ICountResponse> {
    const count = await this.postService.getCountOfPost(keyword);
    return { count };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(
    @Req() req: any,
    @Body() createPostDto: CreatePostDto,
  ): Promise<IStatusResponse> {
    const { id: userId } = req.user;
    return await this.postService.createPost({
      userId,
      ...createPostDto,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(
    @Req() req: any,
    @Param('id', ParseIntPipe) postId: number,
  ): Promise<IStatusResponse> {
    const { id: userId } = req.user;
    return await this.postService.deletePost({ userId, postId });
  }

  @UseGuards(JwtAuthGuard)
  @Get('preference/:id')
  async getMyPostPreferenceIsExist(
    @Req() req: any,
    @Param('id', ParseIntPipe) postId: number,
  ): Promise<IExistResponse> {
    const { id: userId } = req.user;
    return {
      exist: !!(await this.postService.getPostPreferenceByUserIdAndPostId({
        postId,
        userId,
      })),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('preference')
  async createPostPreference(
    @Req() req: any,
    @Body('postId', ParseIntPipe) postId: number,
  ): Promise<IStatusResponse> {
    const { id: userId } = req.user;
    return await this.postService.createPostPreference({
      postId,
      userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('preference/:id')
  async deletePostPreference(
    @Req() req: any,
    @Param('id', ParseIntPipe) postId: number,
  ): Promise<IStatusResponse> {
    const { id: userId } = req.user;
    return await this.postService.deletePostPreference({
      postId,
      userId,
    });
  }
}
