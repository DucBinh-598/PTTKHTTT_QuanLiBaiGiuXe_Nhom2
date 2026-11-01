import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Roles } from '../auth/auth.decorators'
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto'
import { StudentsService } from './students.service'

@Controller('students')
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  @Get()
  findAll(@Query('search') search?: string, @Query('status') status?: string) {
    return this.students.findAll(search, status)
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateStudentDto) {
    return this.students.create(dto)
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.students.update(id, dto)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.students.remove(id)
  }
}
