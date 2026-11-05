import { Body, Controller, Post } from '@nestjs/common'
import { ChatRequestDto } from './dto/chat.dto'
import { AssistantService } from './assistant.service'

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistant: AssistantService) {}

  @Post('chat')
  chat(@Body() dto: ChatRequestDto) {
    return this.assistant.chat(dto.messages)
  }
}
