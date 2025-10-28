import { Body, JsonController, Post } from 'routing-controllers';
import * as sendgrid from '../email/sendgrid';
import { type CreateEventBodyType, EmailType } from '../interfaces';
import logger from '../logger';
import { EnvLoader } from '../env/env.loader';

@JsonController()
class EventController {
  emailService: sendgrid.EmailService;

  constructor() {
    this.emailService = sendgrid.EmailService.getInstance();
  }
  @Post('/create-event')
  async removeUserFromProject(
    @Body() eventBodyProps: CreateEventBodyType,
  ): Promise<{ success: boolean }> {
    const {
      orgName,
      projectName,
      userName,
      orgOwnerEmail,
      projectOwnerEmail,
      description,
      path,
      title,
    } = eventBodyProps;

    if (
      !orgName ||
      !projectName ||
      !userName ||
      !orgOwnerEmail ||
      !projectOwnerEmail ||
      !path
    ) {
      throw Error('Input Validation Error');
    }
    const url = `${EnvLoader.getOrThrow('BASE_URL')}${path}?redirect=true`;
    const sendEmailProps = {
      ...eventBodyProps,
      description: description ?? '-No Description-',
      type: EmailType.CREATE_EVENT,
      url,
    };
    await this.emailService.createEvent(sendEmailProps);
    logger?.info(
      `Event email triggered — 
   Title: "${title}", 
   Recipients: ${orgOwnerEmail} and ${projectOwnerEmail}, 
   Redirect URL: ${url}`,
    );

    return { success: true };
  }
}

export default EventController;
